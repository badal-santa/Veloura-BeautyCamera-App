# Veloura — Features

Veloura is a beauty camera and photo studio for Android (iOS support is partial — see the end). It can also act as the phone's Home screen ("Veloura Home"). Everything runs on the device: photos and videos are never uploaded, there are no accounts, no ads and no analytics.

Status as of October 2026, version 1.0.0.

---

## App structure

| Area | How to get there |
|---|---|
| **Home** | First tab. Greeting, camera / edit / templates shortcuts, quick tools, trending looks, "Made for you" suggestions, recent creations. |
| **Editor** | Second tab. Open a photo, quick crop frames (1:1, 4:5, 9:16), all tools grouped as Retouch / Layout / Create, signature looks. |
| **Camera** | Raised pink button in the middle of the tab bar. |
| **Templates** | Fourth tab. Featured template plus a gallery of designs, filtered by category. |
| **Profile ("You")** | Fifth tab. Stats, latest creations, Veloura Home switch, Gallery, Settings, Privacy, Share. |

First launch: splash screen → one-time "Make Veloura your Home" prompt (Android, can be skipped) → Home tab. There is no onboarding.

---

## Beauty camera

Opened from the centre tab button, the Home screen camera card, or Veloura Home.

- Live preview, front camera first (mirrored like a selfie), switch front/back.
- Flash off / on / auto, 3 s / 10 s self-timer with a countdown, optional rule-of-thirds grid.
- **Beauty**: Smooth, Brighten, Skin tone, Glow, Warmth — each 0–100, with *Before* (hold) and *Reset*.
- **Filters**: Natural, Bloom, Golden, Cool, Mono, Film.
- **Adjust**: Exposure −100 to +100.
- The live preview shows an approximation of the look; the exact effect is applied after the photo is taken.

## Photo editor

Opens after taking a photo, or for any photo picked from the phone.

- Tabs: **Beauty · Makeup · Filters · Adjust · Crop**.
- **Skin-smart beauty**: if a face is found, smoothing applies to skin only — eyes, brows, lips and hair stay sharp. A "Skin-smart beauty · 1 face" badge confirms it.
- **Makeup**: Lipstick (7 shades), Blush (6), Eyeshadow (7), each with intensity. Placed exactly on the lips, cheeks and eyelids found by face detection. Needs a clear, front-facing face.
- **Crop**: Original, 1:1, 4:5, 3:4, 9:16, 16:9; drag to reposition; rotate 90°.
- **Undo / redo** for every change (a whole slider drag counts as one step, up to 50 steps).
- Save to gallery, share, or continue to *Decorate* (stickers and text).
- Photos are shown upright even when the phone stored them rotated.

## Decorate — stickers, text, watermark

- 30 emoji stickers: drag, pinch to resize, twist to rotate, × to delete.
- Text in three styles (Plain, Pill, Neon) and 8 colours; edit the selected text live.
- Watermark "✦ @yourname" in any corner, 40–100 % opacity.
- Undo / redo.
- Opened from Home → *Stickers* / *Watermark*, Editor → *Stickers & text*, or the sticker button in the photo editor.

## Collage

- 2–4 photos, 12 layouts — 4 for each photo count (grids, hero + small, side columns, mosaic).
- Style: ratio 1:1 / 4:5 / 9:16, spacing, corner rounding, 8 background colours.
- Drag inside any frame to reposition that photo.
- Opened from Home → *Collage* or Editor → Layout → *Collage*.

## Remove background (Android)

- Cuts the person out of a photo on the device (works on people, not objects).
- New background: transparent (saved as PNG), blur of the original, any photo, 6 gradients, 8 colours.
- Edges are refined to follow the subject and cleaned of the old background's colour; very fine hair can still show a faint rim.
- Opened from Editor → Retouch → *Remove BG*.

## Templates

- 8 designs in 5 categories (For you, Stylish, Social, Story, Romance): editorial frame, story frame, polaroid, arch, minimal, neon border, love-letter polaroid, full-bleed post.
- Each opens with a sample photo; *Add your photo*, drag and zoom it, edit the caption, pick a filter, then save or share.

## Video Studio (Android)

- Pick a video, trim the start and end on a thumbnail timeline, preview in a loop, turn sound off.
- Exports instantly at full quality (no re-encoding). The start of the clip snaps to the nearest keyframe, usually within about a second.
- Opened from Home → *Video* or Editor → Create → *Edit video*.

## Gallery

- *Choose from your phone* opens Android's photo picker (no storage permission needed).
- *My creations* lists photos saved from Veloura; tap to edit again, long-press to remove from Veloura.

## Veloura Home (Android launcher)

Optional. Turned on from Profile → *Veloura Home* (or the first-run prompt), then chosen in Android's "default home app" dialog.

- Home screen over your wallpaper: greeting and clock, a Veloura Studio card (Camera, Editor, Templates, Studio), app search, pinned apps and a dock.
- Swipe up for all apps (A–Z with search); swipe down for notifications.
- Long-press an app: Pin to Home, Add to Dock, App info, Uninstall.
- Long-press empty space: Home settings.
- Home and the Veloura app run in separate windows, so the Home button and swipe-up gesture minimise the app normally.
- Turning the switch off removes Veloura from the Home app list.

## Settings

Profile → gear, or the Home screen tune button.

- **Camera**: mirror selfies, shutter sound, grid lines, keep saved photos in My creations.
- **Home**: grid columns (4/5), icon size, show names, text size, accent colour (Rose, Violet, Sunset, Ocean) — with a live preview.
- **Drawer**: columns, show names, background opacity.
- **General**: haptic feedback, privacy summary, reset Veloura Home, restore default settings.

---

## Privacy

- All processing — beauty, makeup, face detection, background removal, video trimming — happens on the phone.
- No accounts, ads, analytics or network calls for app features.
- Permissions: camera (taking photos), photo/video library (saving results; picking uses the system picker), and for Veloura Home the ability to list, launch and offer to uninstall apps. The microphone permission is explicitly not requested.

## Not yet built

Shown as "coming soon" or *SOON* in the app: Freestyle canvas, Pic sew, Mask overlays, Rate Veloura, Contact support. Planned: home-screen widgets, folders, drag-to-rearrange on Veloura Home.

## Platform notes

Built and tested on Android (Moto g96, Android 16). Video Studio, Remove BG, face-aware beauty, makeup and Veloura Home rely on Android-native code and are hidden or inactive on iOS. The rest of the app is cross-platform but has not been tested on iOS.
