import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html'
})
export class UserPanelComponent implements OnInit, OnChanges {
  @Input() userInfo;
  public userImage: string;
  constructor() { }

  ngOnInit() {
    this.userImage = this.userInfo.userImg ? `api/${this.userInfo.userImg}` : 'assets/user-default.png';
  }
  ngOnChanges() {
  }
}
