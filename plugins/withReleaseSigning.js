const { withAppBuildGradle } = require('expo/config-plugins');

const MARK = '// @veloura release-signing';

/**
 * Signs release builds with the Veloura upload key.
 *
 * The key never lives in the repo: its path and passwords come from Gradle
 * properties (usually ~/.gradle/gradle.properties):
 *   VELOURA_UPLOAD_STORE_FILE, VELOURA_UPLOAD_KEY_ALIAS,
 *   VELOURA_UPLOAD_STORE_PASSWORD, VELOURA_UPLOAD_KEY_PASSWORD
 * Without them, release builds fall back to the debug key (local testing only).
 */
module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let gradle = cfg.modResults.contents;
    if (gradle.includes(MARK)) return cfg;

    gradle = gradle.replace(
      /signingConfigs \{\n(\s*)debug \{/,
      `signingConfigs {
        ${MARK}
        release {
            if (project.hasProperty('VELOURA_UPLOAD_STORE_FILE')) {
                storeFile file(VELOURA_UPLOAD_STORE_FILE)
                storePassword VELOURA_UPLOAD_STORE_PASSWORD
                keyAlias VELOURA_UPLOAD_KEY_ALIAS
                keyPassword VELOURA_UPLOAD_KEY_PASSWORD
            }
        }
$1debug {`,
    );

    // In the release build type, use the upload key when it is configured.
    gradle = gradle.replace(
      /(release \{[^{}]*?)signingConfig signingConfigs\.debug/,
      `$1signingConfig project.hasProperty('VELOURA_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`,
    );

    if (!gradle.includes("signingConfigs.release : signingConfigs.debug")) {
      throw new Error('withReleaseSigning: could not patch the release signingConfig');
    }
    cfg.modResults.contents = gradle;
    return cfg;
  });
};
