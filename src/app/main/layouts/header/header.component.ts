import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() toogleCollapsed = new EventEmitter();
  @Input() userInfo;

  constructor(private fireBaseAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }
  logout() {
    console.log('logout');
    this.fireBaseAuth.auth.signOut();
    localStorage.removeItem('userId');
    this.router.navigate(['']);
  }
  ngOnChanges() {}
}
