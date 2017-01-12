import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export
type TimeRange = { from: Date, to: Date }
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'pw-input-availability',
  templateUrl: './input-availability.component.html',
  styleUrls: [
    './input-availability.component.css',
  ]
})
export class InputAvailabilityComponent implements OnInit {
  @Input() default: TimeRange
  @Output() confirm = new EventEmitter<TimeRange>()

  availform = new FormGroup({
    from: new FormControl(new Date),
    to: new FormControl(new Date),
  })

  constructor() {}

  ngOnInit() {
    const {from, to} = this.availform.controls
    // on init
    if (this.default) {
      from.setValue(this.default.from)
      to.setValue(this.default.to)
    } else {
      from.setValue(new Date)
      to.setValue(new Date)
    }
  }

  onConfirm() {
    const {from, to} = this.availform.controls
    // TODO Actually update from and to when time inputs change
    this.confirm.emit({ from: from.value, to: to.value })
  }
}
