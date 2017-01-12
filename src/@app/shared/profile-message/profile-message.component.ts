import { Component, Input } from '@angular/core'

import * as M from '@app/core/model'

@Component({
  selector: 'pw-profile-message',
  templateUrl: './profile-message.component.html',
  styleUrls: [
    './profile-message.component.css',
    '../shared/message.css',
  ]
})
export class ProfileMessageComponent {
  @Input() profile: M.Profile
  @Input() messageText: string
  @Input() action: string
  @Input() time: string
}
