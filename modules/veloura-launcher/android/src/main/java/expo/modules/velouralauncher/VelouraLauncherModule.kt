package expo.modules.velouralauncher

import android.app.role.RoleManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.graphics.Bitmap
import android.media.MediaCodec
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMetadataRetriever
import android.media.MediaMuxer
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceContour
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.segmentation.Segmentation
import com.google.mlkit.vision.segmentation.selfie.SelfieSegmenterOptions
import android.graphics.BitmapFactory
import java.nio.ByteOrder
import androidx.core.graphics.drawable.toBitmap
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer

class VelouraLauncherModule : Module() {
  companion object {
    @Volatile private var instance: VelouraLauncherModule? = null

    /** Called by LauncherActivity when Back is pressed on the Home screen. */
    @JvmStatic
    fun emitLauncherBack() {
      instance?.sendEvent("onLauncherBack", emptyMap<String, Any>())
    }
  }

  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context is not available")

  private var packageReceiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("VelouraLauncher")

    Events("onPackagesChanged", "onLaunchIntent", "onLauncherBack")

    OnCreate { instance = this@VelouraLauncherModule }
    OnDestroy { if (instance === this@VelouraLauncherModule) instance = null }

    // ── Video Studio ────────────────────────────────────────────────────────

    /** Duration (ms), display size and whether the video has sound. */
    AsyncFunction("getVideoInfo") { uri: String -> videoInfo(uri) }

    /** `count` evenly spaced frames as cached JPEG file:// URIs. */
    AsyncFunction("getVideoThumbnails") { uri: String, count: Int, maxWidth: Int ->
      videoThumbnails(uri, count, maxWidth)
    }

    /**
     * Lossless trim (no re-encode): copies samples between start and end into a new MP4.
     * The start snaps back to the previous keyframe. `mute` drops the audio track.
     */
    AsyncFunction("trimVideo") { uri: String, startMs: Double, endMs: Double, mute: Boolean ->
      trimVideo(uri, startMs.toLong(), endMs.toLong(), mute)
    }

    // ── Face detection (beauty) ─────────────────────────────────────────────

    /**
     * Faces in an image file, with contours normalized to 0–1 of the image size.
     * Runs fully on device (ML Kit bundled model).
     */
    AsyncFunction("detectFaces") { uri: String -> detectFaces(uri) }

    /**
     * Remove BG: cuts the person out of an (upright) image file.
     * Returns a PNG with transparent background, same size as the input.
     */
    AsyncFunction("removeBackground") { uri: String -> removeBackground(uri) }

    /** Sends the user to their Home screen (Veloura Home when it's the default). */
    Function("goHome") {
      startActivity(
        Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      )
    }

    /** All launchable apps (except Veloura) with labels and cached PNG icons, sorted A–Z. */
    AsyncFunction("getApps") { iconSize: Int -> loadApps(iconSize) }

    Function("launchApp") { packageName: String, activityName: String ->
      val intent = Intent(Intent.ACTION_MAIN)
        .addCategory(Intent.CATEGORY_LAUNCHER)
        .setClassName(packageName, activityName)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
      startActivity(intent)
    }

    Function("openAppInfo") { packageName: String ->
      startActivity(
        Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:$packageName"))
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      )
    }

    Function("uninstallApp") { packageName: String ->
      startActivity(
        Intent(Intent.ACTION_DELETE, Uri.parse("package:$packageName"))
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      )
    }

    /** Home mode = the HOME activity-alias is enabled, so Veloura appears in the home chooser. */
    Function("isHomeModeEnabled") {
      val alias = homeAlias() ?: return@Function false
      context.packageManager.getComponentEnabledSetting(alias) == PackageManager.COMPONENT_ENABLED_STATE_ENABLED
    }

    Function("setHomeModeEnabled") { enabled: Boolean ->
      val alias = homeAlias() ?: throw IllegalStateException("Home alias is missing from the manifest")
      context.packageManager.setComponentEnabledSetting(
        alias,
        if (enabled) PackageManager.COMPONENT_ENABLED_STATE_ENABLED
        else PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        PackageManager.DONT_KILL_APP
      )
    }

    Function("isDefaultLauncher") {
      val home = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
      val resolved = context.packageManager.resolveActivity(home, PackageManager.MATCH_DEFAULT_ONLY)
      resolved?.activityInfo?.packageName == context.packageName
    }

    /** Opens the system "default home app" dialog (Android 10+) or the Home settings page. */
    Function("requestDefaultLauncher") {
      val activity = appContext.currentActivity
      val roles =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) activity?.getSystemService(RoleManager::class.java) else null
      if (activity != null && roles != null && roles.isRoleAvailable(RoleManager.ROLE_HOME) && !roles.isRoleHeld(RoleManager.ROLE_HOME)) {
        activity.startActivityForResult(roles.createRequestRoleIntent(RoleManager.ROLE_HOME), 0)
      } else {
        startActivity(Intent(Settings.ACTION_HOME_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
      }
    }

    Function("expandNotifications") {
      try {
        val service = context.getSystemService("statusbar")
        Class.forName("android.app.StatusBarManager").getMethod("expandNotificationsPanel").invoke(service)
      } catch (_: Exception) {
        // Not supported on this device — ignore.
      }
    }

    /** How the current activity was opened: "home" (Home button), "icon", or "other". */
    Function("getLaunchSource") { sourceOf(appContext.currentActivity?.intent) }

    OnNewIntent { intent ->
      sendEvent("onLaunchIntent", mapOf("source" to sourceOf(intent)))
    }

    OnStartObserving("onPackagesChanged") {
      val receiver = object : BroadcastReceiver() {
        override fun onReceive(ctx: Context, intent: Intent) {
          val pkg = intent.data?.schemeSpecificPart ?: return
          clearIconCache(pkg)
          sendEvent("onPackagesChanged", mapOf("packageName" to pkg, "action" to (intent.action ?: "")))
        }
      }
      val filter = IntentFilter().apply {
        addAction(Intent.ACTION_PACKAGE_ADDED)
        addAction(Intent.ACTION_PACKAGE_REMOVED)
        addAction(Intent.ACTION_PACKAGE_CHANGED)
        addAction(Intent.ACTION_PACKAGE_REPLACED)
        addDataScheme("package")
      }
      ContextCompat.registerReceiver(context, receiver, filter, ContextCompat.RECEIVER_NOT_EXPORTED)
      packageReceiver = receiver
    }

    OnStopObserving("onPackagesChanged") {
      packageReceiver?.let { runCatching { context.unregisterReceiver(it) } }
      packageReceiver = null
    }
  }

  private fun startActivity(intent: Intent) {
    val activity = appContext.currentActivity
    if (activity != null) activity.startActivity(intent) else context.startActivity(intent)
  }

  private fun sourceOf(intent: Intent?): String = when {
    intent == null -> "other"
    intent.hasCategory(Intent.CATEGORY_HOME) -> "home"
    intent.hasCategory(Intent.CATEGORY_LAUNCHER) -> "icon"
    else -> "other"
  }

  /** The HOME activity-alias declared by the app's config plugin (it's disabled by default). */
  private fun homeAlias(): ComponentName? {
    val query = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME).setPackage(context.packageName)
    val flags = PackageManager.MATCH_DISABLED_COMPONENTS
    val matches: List<ResolveInfo> =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        context.packageManager.queryIntentActivities(query, PackageManager.ResolveInfoFlags.of(flags.toLong()))
      } else {
        @Suppress("DEPRECATION")
        context.packageManager.queryIntentActivities(query, flags)
      }
    val info = matches.firstOrNull()?.activityInfo ?: return null
    return ComponentName(info.packageName, info.name)
  }

  private fun iconDir() = File(context.cacheDir, "launcher-icons").apply { mkdirs() }

  private fun clearIconCache(packageName: String) {
    iconDir().listFiles { f -> f.name.startsWith("$packageName@") }?.forEach { it.delete() }
  }

  private fun loadApps(iconSize: Int): List<Map<String, String>> {
    val pm = context.packageManager
    val query = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
    val activities: List<ResolveInfo> =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        pm.queryIntentActivities(query, PackageManager.ResolveInfoFlags.of(0))
      } else {
        @Suppress("DEPRECATION")
        pm.queryIntentActivities(query, 0)
      }
    val dir = iconDir()

    return activities
      .filter { it.activityInfo.packageName != context.packageName }
      .map { info ->
        val pkg = info.activityInfo.packageName
        val activity = info.activityInfo.name
        val file = File(dir, "$pkg@${activity.hashCode()}@$iconSize.png")
        if (!file.exists()) {
          runCatching {
            val bitmap = info.loadIcon(pm).toBitmap(iconSize, iconSize, Bitmap.Config.ARGB_8888)
            FileOutputStream(file).use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
          }
        }
        mapOf(
          "packageName" to pkg,
          "activityName" to activity,
          "label" to info.loadLabel(pm).toString(),
          "icon" to Uri.fromFile(file).toString()
        )
      }
      .sortedBy { it["label"]!!.lowercase() }
  }

  private fun retriever(uri: String) = MediaMetadataRetriever().apply { setDataSource(context, Uri.parse(uri)) }

  private fun videoInfo(uri: String): Map<String, Any> {
    val r = retriever(uri)
    try {
      val rotation = r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)?.toIntOrNull() ?: 0
      var w = r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH)?.toIntOrNull() ?: 0
      var h = r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT)?.toIntOrNull() ?: 0
      if (rotation % 180 != 0) w = h.also { h = w }
      return mapOf(
        "durationMs" to (r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)?.toLongOrNull() ?: 0L).toDouble(),
        "width" to w,
        "height" to h,
        "hasAudio" to (r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_HAS_AUDIO) == "yes")
      )
    } finally {
      r.release()
    }
  }

  private fun videoThumbnails(uri: String, count: Int, maxWidth: Int): List<String> {
    val r = retriever(uri)
    val dir = File(context.cacheDir, "video-thumbs").apply { mkdirs() }
    val tag = "${uri.hashCode()}-${System.currentTimeMillis()}"
    try {
      val durationUs = (r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)?.toLongOrNull() ?: 0L) * 1000
      return (0 until count).mapNotNull { i ->
        // Middle of each of `count` equal slices.
        val timeUs = durationUs * (2 * i + 1) / (2L * count)
        val frame = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
          r.getScaledFrameAtTime(timeUs, MediaMetadataRetriever.OPTION_CLOSEST_SYNC, maxWidth, maxWidth * 2)
        } else {
          r.getFrameAtTime(timeUs, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)
        } ?: return@mapNotNull null
        val file = File(dir, "$tag-$i.jpg")
        FileOutputStream(file).use { frame.compress(Bitmap.CompressFormat.JPEG, 80, it) }
        frame.recycle()
        Uri.fromFile(file).toString()
      }
    } finally {
      r.release()
    }
  }

  private fun trimVideo(uri: String, startMs: Long, endMs: Long, mute: Boolean): Map<String, Any> {
    val out = File(context.cacheDir, "veloura-video-${System.currentTimeMillis()}.mp4")
    val extractor = MediaExtractor()
    var muxer: MediaMuxer? = null
    try {
      extractor.setDataSource(context, Uri.parse(uri), null)
      val m = MediaMuxer(out.path, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
      muxer = m

      val trackMap = HashMap<Int, Int>()
      var bufferSize = 1 shl 20
      for (i in 0 until extractor.trackCount) {
        val format = extractor.getTrackFormat(i)
        val mime = format.getString(MediaFormat.KEY_MIME) ?: continue
        val keep = mime.startsWith("video/") || (mime.startsWith("audio/") && !mute)
        if (!keep) continue
        extractor.selectTrack(i)
        trackMap[i] = m.addTrack(format)
        if (format.containsKey(MediaFormat.KEY_MAX_INPUT_SIZE)) {
          bufferSize = maxOf(bufferSize, format.getInteger(MediaFormat.KEY_MAX_INPUT_SIZE))
        }
      }
      if (trackMap.isEmpty()) throw IllegalStateException("No playable tracks in this video")

      val r = retriever(uri)
      val rotation = r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)?.toIntOrNull() ?: 0
      r.release()
      m.setOrientationHint(rotation)
      m.start()

      val startUs = startMs * 1000
      val endUs = endMs * 1000
      extractor.seekTo(startUs, MediaExtractor.SEEK_TO_PREVIOUS_SYNC)

      val buffer = ByteBuffer.allocate(bufferSize)
      val info = MediaCodec.BufferInfo()
      val finished = HashSet<Int>()
      var baseUs = -1L
      var lastUs = 0L

      while (true) {
        val track = extractor.sampleTrackIndex
        if (track < 0) break
        val size = extractor.readSampleData(buffer, 0)
        if (size < 0) break
        val timeUs = extractor.sampleTime
        if (timeUs > endUs) {
          finished.add(track)
          if (finished.size >= trackMap.size) break
          extractor.advance()
          continue
        }
        if (baseUs < 0) baseUs = timeUs
        if (timeUs >= baseUs) {
          info.offset = 0
          info.size = size
          info.presentationTimeUs = timeUs - baseUs
          info.flags = if (extractor.sampleFlags and MediaExtractor.SAMPLE_FLAG_SYNC != 0) MediaCodec.BUFFER_FLAG_KEY_FRAME else 0
          m.writeSampleData(trackMap.getValue(track), buffer, info)
          lastUs = maxOf(lastUs, info.presentationTimeUs)
        }
        extractor.advance()
      }

      m.stop()
      return mapOf("uri" to Uri.fromFile(out).toString(), "durationMs" to (lastUs / 1000).toDouble())
    } catch (e: Exception) {
      out.delete()
      throw e
    } finally {
      runCatching { muxer?.release() }
      extractor.release()
    }
  }

  private val faceDetector by lazy {
    FaceDetection.getClient(
      FaceDetectorOptions.Builder()
        .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
        .setContourMode(FaceDetectorOptions.CONTOUR_MODE_ALL)
        .setMinFaceSize(0.1f)
        .build()
    )
  }

  private fun detectFaces(uri: String): List<Map<String, Any>> {
    val image = InputImage.fromFilePath(context, Uri.parse(uri))
    val w = image.width.toFloat()
    val h = image.height.toFloat()
    val faces = Tasks.await(faceDetector.process(image))

    fun contour(face: com.google.mlkit.vision.face.Face, type: Int): List<List<Double>> =
      face.getContour(type)?.points?.map { listOf((it.x / w).toDouble(), (it.y / h).toDouble()) } ?: emptyList()

    return faces.map { face ->
      val b = face.boundingBox
      mapOf(
        "bounds" to mapOf(
          "x" to (b.left / w).toDouble(),
          "y" to (b.top / h).toDouble(),
          "width" to (b.width() / w).toDouble(),
          "height" to (b.height() / h).toDouble()
        ),
        "oval" to contour(face, FaceContour.FACE),
        "leftEye" to contour(face, FaceContour.LEFT_EYE),
        "rightEye" to contour(face, FaceContour.RIGHT_EYE),
        "leftBrow" to contour(face, FaceContour.LEFT_EYEBROW_TOP) + contour(face, FaceContour.LEFT_EYEBROW_BOTTOM).reversed(),
        "rightBrow" to contour(face, FaceContour.RIGHT_EYEBROW_TOP) + contour(face, FaceContour.RIGHT_EYEBROW_BOTTOM).reversed(),
        "lips" to contour(face, FaceContour.UPPER_LIP_TOP) + contour(face, FaceContour.LOWER_LIP_BOTTOM),
        // Inner edge of the lips (teeth / open mouth area).
        "mouth" to contour(face, FaceContour.UPPER_LIP_BOTTOM) + contour(face, FaceContour.LOWER_LIP_TOP)
      )
    }
  }

  private val segmenter by lazy {
    Segmentation.getClient(
      SelfieSegmenterOptions.Builder().setDetectorMode(SelfieSegmenterOptions.SINGLE_IMAGE_MODE).build()
    )
  }

  private fun removeBackground(uri: String): Map<String, Any> {
    val path = Uri.parse(uri).path ?: throw IllegalArgumentException("Not a file: $uri")
    val source = BitmapFactory.decodeFile(path) ?: throw IllegalStateException("Could not read image")
    val bmp = source.copy(Bitmap.Config.ARGB_8888, true)
    if (bmp !== source) source.recycle()

    val mask = Tasks.await(segmenter.process(InputImage.fromBitmap(bmp, 0)))
    val buf = mask.buffer.order(ByteOrder.nativeOrder())
    buf.rewind()
    val w = bmp.width
    val h = bmp.height
    val mw = mask.width
    val mh = mask.height
    val conf = FloatArray(mw * mh)
    buf.asFloatBuffer().get(conf)

    val pixels = IntArray(w * h)
    bmp.getPixels(pixels, 0, w, 0, 0, w, h)
    val n = w * h

    // 1. Smooth (bilinear) upsampling of the low-res model mask — no stair steps.
    val p = FloatArray(n)
    for (y in 0 until h) {
      val fy = ((y + 0.5f) * mh / h - 0.5f).coerceIn(0f, (mh - 1).toFloat())
      val y0 = fy.toInt(); val y1 = minOf(y0 + 1, mh - 1); val ty = fy - y0
      for (x in 0 until w) {
        val fx = ((x + 0.5f) * mw / w - 0.5f).coerceIn(0f, (mw - 1).toFloat())
        val x0 = fx.toInt(); val x1 = minOf(x0 + 1, mw - 1); val tx = fx - x0
        val top = conf[y0 * mw + x0] * (1 - tx) + conf[y0 * mw + x1] * tx
        val bot = conf[y1 * mw + x0] * (1 - tx) + conf[y1 * mw + x1] * tx
        p[y * w + x] = top * (1 - ty) + bot * ty
      }
    }

    // 2. Guided filter: snaps the mask edge to real edges in the photo (hair, shoulders).
    val guide = FloatArray(n)
    for (i in 0 until n) {
      val c = pixels[i]
      guide[i] = (0.299f * ((c shr 16) and 255) + 0.587f * ((c shr 8) and 255) + 0.114f * (c and 255)) / 255f
    }
    val r = maxOf(4, maxOf(w, h) / 160)
    val alpha = guidedFilter(guide, p, w, h, r, 1e-3f)
    var kept = 0
    for (i in 0 until n) {
      // Gentle contrast curve: firm inside/outside, soft transition at the edge.
      // Slightly tight: background pixels at the rim stay transparent.
      val a = ((alpha[i] - 0.38f) / 0.42f).coerceIn(0f, 1f)
      alpha[i] = a * a * (3 - 2 * a)
      if (alpha[i] > 0.5f) kept++
    }

    // 3. Colour decontamination: remove the old background's tint from edge pixels.
    //    Estimate the local background B, then solve I = a·F + (1−a)·B for F.
    val br = r * 3
    val bgW = FloatArray(n) { 1f - alpha[it] }
    val tmp = FloatArray(n)
    val bgWeight = boxFilter(bgW, w, h, br, tmp)
    val channels = Array(3) { ch ->
      val shift = 16 - ch * 8
      val weighted = FloatArray(n) { (((pixels[it] shr shift) and 255) / 255f) * bgW[it] }
      boxFilter(weighted, w, h, br, tmp)
    }
    // Local subject colour, used to pull rim pixels away from the old background.
    val fgWeight = boxFilter(alpha, w, h, br, tmp)
    val fgChannels = Array(3) { ch ->
      val shift = 16 - ch * 8
      val weighted = FloatArray(n) { (((pixels[it] shr shift) and 255) / 255f) * alpha[it] }
      boxFilter(weighted, w, h, br, tmp)
    }
    for (i in 0 until n) {
      val a = alpha[i]
      val c = pixels[i]
      var rgb = c and 0x00FFFFFF
      if (a > 0.02f && a < 0.98f && bgWeight[i] > 1e-3f) {
        var out = 0
        for (ch in 0 until 3) {
          val shift = 16 - ch * 8
          val iv = ((c shr shift) and 255) / 255f
          val bv = channels[ch][i] / bgWeight[i]
          var fv = ((iv - (1 - a) * bv) / a).coerceIn(0f, 1f)
          if (fgWeight[i] > 1e-3f) {
            val fg = fgChannels[ch][i] / fgWeight[i]
            // Stronger for faint rim pixels, gentle near the solid subject.
            val pull = Math.sqrt((1 - a).toDouble()).toFloat() * 0.9f
            fv = fv * (1 - pull) + fg * pull
          }
          out = out or ((fv * 255).toInt() shl shift)
        }
        rgb = out
      }
      pixels[i] = ((a * 255).toInt() shl 24) or rgb
    }

    // JPEG-decoded bitmaps are flagged opaque, so write into a fresh bitmap with alpha.
    val cut = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
    cut.setHasAlpha(true)
    cut.setPixels(pixels, 0, w, 0, 0, w, h)
    bmp.recycle()

    val out = File(context.cacheDir, "cutout-${System.currentTimeMillis()}.png")
    FileOutputStream(out).use { cut.compress(Bitmap.CompressFormat.PNG, 100, it) }
    cut.recycle()
    return mapOf(
      "uri" to Uri.fromFile(out).toString(),
      "width" to w,
      "height" to h,
      // Share of the image that is the subject — 0 means no person was found.
      "coverage" to kept.toDouble() / (w * h).toDouble()
    )
  }

  /** Mean over a (2r+1)² box, edge-normalized. Separable running sums, O(n). */
  private fun boxFilter(src: FloatArray, w: Int, h: Int, r: Int, tmp: FloatArray): FloatArray {
    val out = FloatArray(src.size)
    for (y in 0 until h) {
      val row = y * w
      var sum = 0f
      for (x in 0..minOf(r, w - 1)) sum += src[row + x]
      for (x in 0 until w) {
        val lo = x - r; val hi = x + r
        tmp[row + x] = sum / (minOf(hi, w - 1) - maxOf(lo, 0) + 1)
        if (hi + 1 < w) sum += src[row + hi + 1]
        if (lo >= 0) sum -= src[row + lo]
      }
    }
    for (x in 0 until w) {
      var sum = 0f
      for (y in 0..minOf(r, h - 1)) sum += tmp[y * w + x]
      for (y in 0 until h) {
        val lo = y - r; val hi = y + r
        out[y * w + x] = sum / (minOf(hi, h - 1) - maxOf(lo, 0) + 1)
        if (hi + 1 < h) sum += tmp[(hi + 1) * w + x]
        if (lo >= 0) sum -= tmp[lo * w + x]
      }
    }
    return out
  }

  /** He et al. guided filter (grey guide): edge-aware smoothing of `p` along `guide`. */
  private fun guidedFilter(guide: FloatArray, p: FloatArray, w: Int, h: Int, r: Int, eps: Float): FloatArray {
    val n = guide.size
    val tmp = FloatArray(n)
    val meanI = boxFilter(guide, w, h, r, tmp)
    val meanP = boxFilter(p, w, h, r, tmp)
    val ii = FloatArray(n) { guide[it] * guide[it] }
    val ip = FloatArray(n) { guide[it] * p[it] }
    val corrI = boxFilter(ii, w, h, r, tmp)
    val corrIP = boxFilter(ip, w, h, r, tmp)
    val a = FloatArray(n)
    val b = FloatArray(n)
    for (i in 0 until n) {
      val varI = corrI[i] - meanI[i] * meanI[i]
      val covIP = corrIP[i] - meanI[i] * meanP[i]
      a[i] = covIP / (varI + eps)
      b[i] = meanP[i] - a[i] * meanI[i]
    }
    val meanA = boxFilter(a, w, h, r, tmp)
    val meanB = boxFilter(b, w, h, r, tmp)
    return FloatArray(n) { meanA[it] * guide[it] + meanB[it] }
  }
}
