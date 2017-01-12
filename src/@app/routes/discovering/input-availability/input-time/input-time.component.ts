import {
  Component, OnInit, OnChanges,
  Input, Output, EventEmitter,
  forwardRef
} from '@angular/core';

import { FormGroup, FormControl,
    ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment'

import { Subscription } from 'rxjs'

@Component({
  selector: 'pw-input-time',
  templateUrl: './input-time.component.html',
  providers: [
    // This providers stuff is given to us from an article on ThoughtRam:
    // http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html#registering-the-controlvalueaccessor
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTimeComponent),
      multi: true
    }
  ],
  styleUrls: [
    './input-time.component.css',
  ]
})
export class InputTimeComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() value: Date
  @Output() change = new EventEmitter<Date>()
  @Output() touch = new EventEmitter()

  subs: Subscription[] = []

  timeform = new FormGroup({
    apradio: new FormControl('AM'),
    hours: new FormControl(0),
    minutes: new FormControl(0),
  })

  constructor() {
    const valsub = this.timeform.valueChanges.subscribe((n) => {
      const { apradio, hours, minutes } = this.timeform.controls
      const a = apradio.value === 'AM'
      const hs = hours.value + (a ? 0 : 12)
      const ms = minutes.value
      let val = moment().set('minutes', ms).set('hours', hs)

      this.change.emit(val.toDate())
    })

    // store form changes subscription so we can unsubscribe later.
    this.subs.push(valsub)
  }

  // Used by control value accessor
  writeValue(obj) {
    if (obj != null) {
      let val = moment(obj)
      val = val.subtract(val.minutes() % 5, 'minutes')
      this.value = val.toDate()
      this.onChanges()
    }
  }

  // Used by control value accessor
  registerOnChange(fn: any) {
    const sub = this.change.subscribe(fn)
    this.subs.push(sub)
  }

  // Used by control value accessor
  registerOnTouched(fn: any) {
    // Here, we are simply listening for validation status calculations
    // to emit the touched event.
    const sub = this.timeform.statusChanges.subscribe(fn)
    this.subs.push(sub)
  }

  ngOnInit() {
    // on init
    this.onChanges()
  }

  ngOnChanges(changes) {
    this.onChanges()
  }

  onChanges() {
    if (!this.value) {
      return
    }

    const { apradio, hours, minutes } = this.timeform.controls

    const hs = this.value.getHours() % 12 || 12
    hours.setValue(hs)

    minutes.setValue(this.value.getMinutes())

    const apvalue = this.value.getHours() < 12 ? 'AM' : 'PM'
    apradio.setValue(apvalue)
  }

  ngOnDestroy() {
    // remove all subscriptions
    this.subs.forEach(s => s.unsubscribe())
  }
}
