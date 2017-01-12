# Garst app

This is a new repository for Project-W to live in, as the previous repo was unequipped to use Ahead-of-Time compilation.

In addition, the dependencies that we were using, have been becoming out of date.
We hope to stay in sync with the upstream of this repo: https://github.com/qdouble/angular-webpack2-starter/tree/minimal
just in case there are some performance improvements or updates to things to make our lives easier.

```
git remote add upstream https://github.com/qdouble/angular-webpack2-starter.git
```

## Developing

```bash
# 1. change directory to the app
cd garst-app

# Get dependencies
npm install

```

### Developing with Styleguide

The `src/@styleguide` portion of the app is intended for testing and developing features
quickly outside the scope of the core source code.

It's features are limited to 

Simple webpack-dev-server: `npm run style:webdev`,

Webpack-dev-server with hot module reloading: `npm run style:webdev:hmr`, and 

Compiling: `npm run style:compile`

After compiling, your code will be put into `www`, and you can deploy normally with `npm run deploy`.

### Developing App

The `src/@app` portion of the codebase contains the core app configuration. Please use
the following commands to do developing `npm run webdev`, `npm run webdev:hmr`, and `npm run compile`.

These commands are described in further detail below.

Then follow the next section to figure deploying to device.

## Deploy to device

Set up your computer with `cordova` and the JDK and Android SDK for deploying to Android.
https://cordova.apache.org/docs/en/latest/guide/platforms/android/

```bash
# 1. change directory to the app
cd garst-app

# Get dependencies
npm install

# 2. Must have this directory available in order to use cordova!
mkdir www

# 3. add cordova platform android or ios
cordova platform add android

# 4. build and deploy files with cordova
# Standard App build, or
npm run compile
# Styleguide App build
npm run style:compile

# 5. Deploy to Android
npm run deploy

# ensure adb is running with devices connected
adb devices

# deploy to cordova either emulator or connected device
# if this command fails, try deleting the platforms directory and re-initializing the android platform
cordova platform add android
```

> The following was included information from the boilerplate starter that this is based off of.

# Complete starter seed project for Angular 2

## Minimal Branch

> Featuring Webpack 2 (and Webpack DLL plugin for faster dev builds). Supports Lazy Loading and AOT compilation.

###### You can use npm, but it's recommended to use yarn as it installs a lot faster and has other benefits https://yarnpkg.com/ . Make sure you are using yarn version 0.16.0 or newer (check with 'yarn --version')

```bash
git clone -b minimal https://github.com/qdouble/angular-webpack2-starter.git
cd angular-webpack2-starter
yarn
yarn start
```

### [Material Branch with Universal (Server-side rendering) support](https://github.com/qdouble/angular-webpack2-starter)

### [Material Branch without Universal (Server-side rendering) support](https://github.com/qdouble/angular-webpack2-starter/tree/no-universal-support)

### [Bootstrap and Universal Branch](https://github.com/qdouble/angular-webpack2-starter/tree/bootstrap-and-universal)

### [Bootstrap Branch](https://github.com/qdouble/angular-webpack2-starter/tree/bootstrap)

## Features

* Angular 2
  * Async loading
  * Treeshaking
  * AOT (Ahead of Time/ Offline) Compilation
* Webpack 2
  * Webpack Dlls (Speeds up devServer builds)
* TypeScript 2
  * @types
* Karma/Jasmine testing
* Protractor for E2E testing

## Project Goals

* The main goal is to provide an environment where you can have great dev tools and create a production application without worrying about adding a bunch of stuff yourself.
* The goal of your design should be so that you can easily copy and paste your app folder and your constants file into to a new update of this project and have it still work. Use constants and have proper separation to make upgrades easy. If you have any suggestions on areas where this starter can be designed to make updates more easy, file an issue.

## Basic scripts

Use `yarn start` for dev server. Default dev port is `3000`.

Use `yarn run start:hmr` to run dev server in HMR mode.

Use `yarn run build` for production build.

Use `yarn run server:prod` for production server and production watch. Default production port is `8088`.

Default ports and option to use proxy backend for dev server can be changed in `constants.js` file.

To create AOT version, run `yarn run compile`. This will compile and build script.
Then you can use `yarn run prodserver` to see to serve files.
Do not use build:aot directly unless you have already compiled.
Use `yarn run compile` instead, it compiles and builds:aot

### HMR (Hot Module Replacement)

HMR mode allows you to update a particular module without reloading the entire application.
The current state of your app is also stored in @ngrx/store allowing you to make updates to
your code without losing your currently stored state.

### AOT  Don'ts

The following are some things that will make AOT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use form.controls.controlName, use form.get(‘controlName’)
- Don’t use control.errors?.someError, use control.hasError(‘someError’)
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- Inputs, Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

### Testing

For unit tests, use `yarn run test` for continuous testing in watch mode and use
`yarn run test:once` for single test. To view code coverage after running test, open `coverage/html/index.html` in your browser.

For e2e tests, use `yarn run e2e`. To run unit test and e2e test at the same time, use `yarn run ci`.

### Wiki Links

[Recommended Steps for merging this starter into existing project](https://github.com/qdouble/angular-webpack2-starter/wiki/Recommended-Steps-for-Merging-Starter-into-Existing-Project)

### License

[MIT](https://github.com/qdouble/angular-webpack2-starter/blob/minimal/LICENSE)
