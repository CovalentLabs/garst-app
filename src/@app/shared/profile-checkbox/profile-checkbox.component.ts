import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import * as M from '@app/core/model'

@Component({
  selector: 'pw-profile-checkbox',
  templateUrl: './profile-checkbox.component.html',
  styleUrls: [
    '../shared/message.css',
    './profile-checkbox.component.css',
  ]
})
export class ProfileCheckboxComponent implements OnInit {
  // <pw-profile-checkbox [profile]="">
  @Input() profile: M.Profile
  // <pw-profile-checkbox [description]="">
  @Input() description: string
  // <pw-profile-checkbox [pea-size]="">
  // <pw-profile-checkbox (open)="">
  // @Output() open = new EventEmitter()

  constructor() {}

  ngOnInit() {
    // on init
  }
}
