import { NgModule }            from '@angular/core'
import { CommonModule }        from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MaterialModule } from '@angular/material'

// import { InterestBlockComponent } from './interest-block/interest-block.component'
// import { CtaButtonComponent } from './cta-button/cta-button.component'

// Components that live in multiple places around the app go here.
// Examples may include: pw-button, pw-input, pw-carousel, etc.

// See https://angular.io/docs/ts/latest/guide/ngmodule.html#!#cleanup

// from Angular 2 ngmodule guide:
// Do not specify app-wide singleton providers in a shared module.
// A lazy loaded module that imports that shared module will make
// its own copy of the service.
import { VitreContainerComponent, VitreComponent } from './vitre-container/vitre-container.component'

import { CelebrationModalComponent } from './celebration-modal/celebration-modal.component'
import { ProfileAvatarComponent } from './profile-avatar/profile-avatar.component'
import { ProfileMessageComponent } from './profile-message/profile-message.component'
import { PanelHeaderComponent } from './panel-header/panel-header.component'
import { PodStackComponent } from './pod-stack/pod-stack.component'
import { ProfileCheckboxComponent } from './profile-checkbox/profile-checkbox.component'

import { AutoGrowDirective } from './auto-grow.directive'
import { ShadowScrollerDirective } from './shadow-scroller.directive'

// import { AwesomePipe }         from './awesome.pipe'
// import { HighlightDirective }  from './highlight.directive'
@NgModule({
  imports:      [ CommonModule, MaterialModule ],
  declarations: [
    CelebrationModalComponent, AutoGrowDirective,
    ShadowScrollerDirective,

    VitreContainerComponent, VitreComponent,
    ProfileAvatarComponent,
    ProfileMessageComponent,
    PanelHeaderComponent,
    PodStackComponent,
    ProfileCheckboxComponent,
  ],
  exports:      [
    CelebrationModalComponent, AutoGrowDirective,
    ShadowScrollerDirective,

    VitreContainerComponent, VitreComponent,
    ProfileAvatarComponent,
    ProfileMessageComponent,
    PanelHeaderComponent,
    PodStackComponent,
    ProfileCheckboxComponent,

    CommonModule, ReactiveFormsModule, FormsModule
  ]
})
export class SharedModule { }
