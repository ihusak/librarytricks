import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TitleService } from 'src/app/shared/title.service';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss']
})
export class HowToUseComponent implements OnInit {
  public userRoles = UserRolesEnum;
  public userInfo: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private translateService: TranslateService,
    private titleService: TitleService)
     { }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.HOW_TO_USE.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.userInfo = this.mainService.userInfo;
  }

}
