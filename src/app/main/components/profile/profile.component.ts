import { Component, OnInit, OnDestroy} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MainService } from '../../main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userInfo: any;
  public previewUrl;
  private observerUserInfoData: Subscription;
  public userRoles = UserRolesEnum;

  constructor(protected appService: AppService, private mainService: MainService) {}

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.previewUrl = this.userInfo.userImg ? 'api/' + this.userInfo.userImg : 'assets/user-default.png';
  }
  ngOnDestroy() {
    console.log('profile destroy');
    if(this.observerUserInfoData) {
       this.observerUserInfoData.unsubscribe();
    }
  }
}
