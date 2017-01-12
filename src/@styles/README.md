## `src/@styles`

This folder is an include path of all SASS files.

This is defined in the Webpack configuration under:

TODO: Update this information. Currently this folder holds all helper functions and variables we need
in order to compile bootstrap, angular-material, and our `global.css` file.

```js
  /**
   * Sass
   * Reference: https://github.com/jtangelder/sass-loader
   * Transforms .scss files to .css
   */
  config.sassLoader = {
    //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
    includePaths: [path.resolve(__dirname, "src/@styles")]
  };
```
