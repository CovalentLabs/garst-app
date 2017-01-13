import { Component, Input } from '@angular/core'

import { Data<%=ItemType%> } from '@app/core/model/lobby-item.model'

@Component({
  selector: 'pw-item-<%=itemtype%>',
  templateUrl: './item-<%=itemtype%>.component.html',
  styleUrls: [
    './item-<%=itemtype%>.component.css',
  ]
})
export class Item<%=ItemType%>Component {
  @Input() data: Data<%=ItemType%>
}
