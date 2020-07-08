import { Component, OnInit, OnDestroy} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userLogin;
  public previewUrl;
  private observerUserInfoData: Subscription;
  private observerUserLoginData: Subscription;

  constructor(protected appService: AppService) {}

  ngOnInit() {
    this.observerUserInfoData = this.appService.userInfoData.subscribe((userInfoData: any) => {
      if (userInfoData && userInfoData.userImg) {
        this.previewUrl = userInfoData.userImg ? 'api/' + userInfoData.userImg : 'assets/user-default.png';
        this.userLogin = userInfoData;
      } else {
        this.observerUserLoginData = this.appService.userLoginData.subscribe((userLoginData: any) => {
          this.previewUrl = userInfoData.userImg ? 'api/' + userInfoData.userImg : 'assets/user-default.png';
          this.userLogin = userLoginData;
        });
      }
    });
  }
  ngOnDestroy() {
    console.log('profile destroy');
    this.observerUserInfoData.unsubscribe();
    this.observerUserLoginData.unsubscribe();
  }
}
