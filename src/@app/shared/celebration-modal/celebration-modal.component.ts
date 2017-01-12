import { Component, OnInit } from '@angular/core';

import { LoginActions } from '@app/core'

@Component({
  selector: 'pw-celebration-modal',
  templateUrl: './celebration-modal.component.html',
  styleUrls: [
    './celebration-modal.component.css',
  ]
})
export class CelebrationModalComponent implements OnInit {
  constructor(private _login: LoginActions) {}

  ngOnInit() {
    // on init
  }

  onClick() {
    this._login.promptLogin()
  }
}
