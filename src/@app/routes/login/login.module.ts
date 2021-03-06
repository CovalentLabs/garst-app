import { NgModule }           from '@angular/core'
import { SharedModule }       from '@app/shared/shared.module'
import { LoginComponent } from './login.component'

import { LoginRoutingModule } from './login-routing.module'
@NgModule({
  imports:      [ SharedModule, LoginRoutingModule ],
  declarations: [ LoginComponent ],
  providers:    []
})
export class LoginModule { }
