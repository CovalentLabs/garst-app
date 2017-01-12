import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Folder } from '../mock-menu.component'

@Component({
  selector: 'pw-mock-tree-view',
  templateUrl: './mock-tree-view.component.html',
  styleUrls: [
    './mock-tree-view.component.css',
  ]
})
export class MockTreeViewComponent implements OnInit {
  @Input() folder: Folder
  @Output() select = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {
    // on init
  }

  onSelect(key: string) {
    this.select.emit(key)
  }
}
