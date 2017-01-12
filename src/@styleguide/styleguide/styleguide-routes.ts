import { Routes } from '@angular/router'

import { StyleguideComponent } from './styleguide.component'
import { TestComponent } from './test.component'
import { TestVitreComponent } from './test-vitre.component'


export const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'vitre', component: TestVitreComponent },
  { path: '', component: StyleguideComponent },
]
export const DECLARATIONS = [TestComponent, TestVitreComponent, StyleguideComponent]
