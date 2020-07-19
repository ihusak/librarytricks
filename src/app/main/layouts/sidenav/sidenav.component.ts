import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() showToggle = true;
  @Input() userInfo;

  @Output() toggleCollapsed = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log('SIDENAV', this.userInfo);
  }

}
