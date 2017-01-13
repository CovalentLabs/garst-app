/**
 * This template is for setting up the secrets files.
 * You may also use the *.example files to guide you,
 * but configuring all the files through this may be
 * the easier way to go.
 *
 * just `npm i -g undergen`
 * and run `under gen setup`
 */

module.exports = {
  variables: [
    { name: "APP_ID", default: () => "com.garstapp.v1" },
    { name: "APP_NAME", default: () => "Garst" },
    { name: "APP_VERSION", default: () => "1.0.0" },
    { name: "FACEBOOK_APP_ID" },
    { name: "FACEBOOK_APP_NAME" },
  ]
}
