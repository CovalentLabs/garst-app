import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiscoverComponent } from './discovering.component';

const routes: Routes = [
  { path: 'discovering', component: DiscoverComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DiscoveringRoutingModule {}
