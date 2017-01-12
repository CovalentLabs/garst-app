import { Component, Input } from '@angular/core';

import { DataText } from '@app/core/model/lobby-item.model'

@Component({
  selector: 'pw-item-text',
  templateUrl: './item-text.component.html',
  styleUrls: [
    './item-text.component.css',
  ]
})
export class ItemTextComponent {
  @Input() data: DataText
}
