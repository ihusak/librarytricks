import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html'
})
export class UserPanelComponent implements OnInit, OnChanges {
  @Input() userLogin;
  public userImage: string;
  constructor() { }

  ngOnInit() {
    this.userImage = this.userLogin.userImg ? `api/${this.userLogin.userImg}` : 'assets/user-default.png';
  }
  ngOnChanges() {
  }
}
