import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private route: Router, private appService: AppService) { }

  ngOnInit() {
    const checkLoggedIn = this.appService.getTokens();
    if (checkLoggedIn.accessToken) {
      this.route.navigate(['main']);
    }
  }
}
