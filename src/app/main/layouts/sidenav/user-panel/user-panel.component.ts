import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html'
})
export class UserPanelComponent implements OnInit, OnChanges {
  @Input() userInfo;
  constructor() { }

  ngOnInit() {
    if (this.userInfo.permission.student) {
      this.userInfo.permission.name = 'Студент';
    }
  }
  ngOnChanges() {
  }
}
