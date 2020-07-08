import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() toogleCollapsed = new EventEmitter();
  @Input() userLogin;

  constructor(private router: Router, private authService: AuthService, private appService: AppService) { }

  ngOnInit() {
  }
  logout() {
    const refreshToken = this.appService.getTokens().refreshToken;
    this.authService.logout(refreshToken).subscribe((data) => {
      this.appService.logout();
      console.log('logout', data);
      this.router.navigate(['/']);
    });
    // this.appService.userLoginData.subscribe((user: any) => {
    //   this.authService.logout(user.tokens.refreshToken).subscribe((data) => {
    //     this.appService.logout();
    //     console.log('logout', data);
    //     this.router.navigate(['/']);
    //   });
    // })
  }
  ngOnChanges() {}
}
