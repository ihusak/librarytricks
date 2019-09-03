import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private fireBaseAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }
  logout() {
    this.fireBaseAuth.auth.signOut();
    localStorage.removeItem('userId');
    this.router.navigate(['']);
  }

}
