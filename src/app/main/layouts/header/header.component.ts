import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toogleCollapsed = new EventEmitter();

  constructor(private fireBaseAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }
  logout() {
    console.log('logout');
    this.fireBaseAuth.auth.signOut();
    localStorage.removeItem('userId');
    this.router.navigate(['']);
  }

}
