import './polyfills.browser.aot';
import './rxjs.imports';
declare var ENV: string;

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { StyleguideModuleNgFactory } from '../compiled/src/@styleguide/styleguide.module.ngfactory';

if ('production' === ENV) {
  enableProdMode();
}

export function main() {
  return platformBrowser().bootstrapModuleFactory(StyleguideModuleNgFactory)
    .catch(err => console.log(err));
}

export function bootstrapDomReady() {
  document.addEventListener('DOMContentLoaded', main);
}

bootstrapDomReady();
