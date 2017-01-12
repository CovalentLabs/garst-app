import { Component, Input } from '@angular/core';

import { DataLockStatusUpdate } from '@app/core/model/lobby-item.model'
import * as M from '@app/core/model'

@Component({
  selector: 'pw-item-lock-update',
  templateUrl: './item-lock-update.component.html',
  styleUrls: [
    '../shared/item-md-icon.css',
  ]
})
export class ItemLockUpdateComponent {
  LOCKED = M.GroupLockStatus.LOCKED
  UNLOCKED = M.GroupLockStatus.UNLOCKED

  @Input() data: DataLockStatusUpdate
}
