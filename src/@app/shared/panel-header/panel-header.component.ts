import { Component, Input } from '@angular/core'

@Component({
  selector: 'pw-panel-header',
  templateUrl: './panel-header.component.html',
  styleUrls: [
    './panel-header.component.css',
  ]
})
export class PanelHeaderComponent {
  @Input() title: string
  @Input() subtitle: string
}
