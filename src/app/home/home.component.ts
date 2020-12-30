import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateLocalService } from '../shared/translate/translate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private route: Router, private translateService: TranslateLocalService) { }

  ngOnInit() {
    const checkLoggedIn = localStorage.getItem('userId');
    if (checkLoggedIn) {
      this.route.navigate(['main']);
    }
  }
}
