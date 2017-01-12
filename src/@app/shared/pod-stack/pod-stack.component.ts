import { Component, Input, Output, EventEmitter } from '@angular/core'

import * as M from '@app/core/model'

@Component({
  selector: 'pw-pod-stack',
  templateUrl: './pod-stack.component.html',
  styleUrls: [
    './pod-stack.component.css',
  ]
})
export class PodStackComponent {
  // <pod-stack [users]="">
  @Input() users: M.GroupUser[]
  // <pod-stack (openUser)="">
  @Output() openUser = new EventEmitter<M.GroupUser>()
}
