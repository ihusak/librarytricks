import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { AppService } from 'src/app/app.service';
import { StudentInfoInterface, CoachInfoInterface, ParentInfoInterface, AdminInfoInterface } from 'src/app/shared/interface/user-info.interface';
import moment from 'moment';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  public userInfo: any;
  public userRoles = UserRolesEnum;

  constructor(
    private mainService: MainService,
    private appService: AppService
    ) { }

  ngOnInit() {
    console.log('rating', this.mainService.userInfo);
    this.userInfo = this.mainService.userInfo;
    this.userInfo.progress = Math.round(this.userInfo.progress);
  }


}
