import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router'

@Component({
  selector: 'pw-<%%=<%= compnamevar%>%%>',
  templateUrl: './<%%=<%= compnamevar%>%%>.component.html',
  styleUrls: [
    './<%%=<%= compnamevar%>%%>.component.css',
  ]
})
export class <%%=<%= CompNameVar%>%%>Component implements OnInit {
  constructor() {}

  ngOnInit() {
    // on init
  }
}
