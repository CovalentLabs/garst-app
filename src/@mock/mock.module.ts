import { NgModule }           from '@angular/core'
import { SharedModule }       from '@app/shared/shared.module'

// Mock State Selector
import { MockMenuComponent } from './mock-menu/mock-menu.component'
import { MockTreeViewComponent } from './mock-menu/mock-tree-view/mock-tree-view.component'
import { TimelineViewComponent } from './mock-menu/timeline-view/timeline-view.component';

@NgModule({
  imports:      [ SharedModule ],
  declarations: [ MockMenuComponent, MockTreeViewComponent, TimelineViewComponent ],
  exports: [ MockMenuComponent ],
  providers:    [
    // Mock Providers?
  ]
})
export class MockModule { }
