
// const { hasProcessFlag, root, testDll } = require('./helpers.js');

const EVENT = process.env.npm_lifecycle_event || '';
const AOTs = EVENT.includes('aot');
// const DEV_SERVER = EVENT.includes('webdev');
const DLL = EVENT.includes('dll');
// const E2E = EVENT.includes('e2e');
// const HMRs = hasProcessFlag('hot');
const PROD = EVENT.includes('prod');
// const WATCH = hasProcessFlag('watch');
const config = require('./webpack.config')

// Change entry for styleguide pages!

if (AOTs) {
  config.entry = {
    main: './src/main.style.browser.aot',
  }
} else if (DLL) {
  throw new Error(`I don't know how to set up DLL, so it does not work with style yet!`)
} else {
  config.entry = {
    main: './src/main.style.browser',
  }
}

config.devtool = PROD ? 'source-map' : 'cheap-module-eval-source-map'

module.exports = config
