import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html'
})
export class UserPanelComponent implements OnInit, OnChanges {
  @Input() userInfo;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    // console.log(this.userInfo, 'onfo');
  }
}
