import { NgModule }           from '@angular/core'
import { SharedModule }       from '@app/shared/shared.module'
import { <%=RouteName%>Component } from './<%=routename%>.component'

import { <%=RouteName%>RoutingModule } from './<%=routename%>-routing.module'
@NgModule({
  imports:      [ SharedModule, <%=RouteName%>RoutingModule ],
  declarations: [ <%=RouteName%>Component ],
  providers:    []
})
export class <%=RouteName%>Module { }
