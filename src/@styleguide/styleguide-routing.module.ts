import { NgModule, Component } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

/* Shared Modules */
import { SharedModule } from '@app/shared/shared.module'
import { MaterialModule } from '@angular/material';

import { routes as sroutes, DECLARATIONS } from './styleguide/styleguide-routes';

@Component({
  selector: 'pw-parent', // <pw-app></pw-app>
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['../@app/shared-style/component/full.css'],
})
export
class ParentComponent {}

export
const routes: Routes = [
  { path: 'styleguide',
    component: ParentComponent,
    children: sroutes
  },
  { path: '', pathMatch: 'full', redirectTo: 'styleguide/vitre' },
  { path: '**', pathMatch: 'full', redirectTo: 'styleguide/vitre' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

    SharedModule,
    MaterialModule,
  ],
  declarations: [ ParentComponent, ...DECLARATIONS ],
  exports: [RouterModule]
})
export class StyleguideRoutingModule {}
