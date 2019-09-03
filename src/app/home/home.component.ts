import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
    const checkLoggedIn = localStorage.getItem('userId');
    console.log(checkLoggedIn);
    if(checkLoggedIn) {
      this.route.navigate(['main']);
    }
  }
}
