import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { <%=RouteName%>Component } from './<%=routename%>.component';

const routes: Routes = [
  { path: '<%=routename%>', component: <%=RouteName%>Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class <%=RouteName%>RoutingModule {}
