import { Component, OnDestroy, OnInit } from '@angular/core';
import {HomeworkInterface, HomeworksService} from '../homeworks.service';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import { HomeworksModel } from '../homeworks.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.scss']
})
export class HomeworkListComponent implements OnInit, OnDestroy {
  public homeworksList: HomeworkInterface[];
  public userInfo: any;
  public userRoles = UserRolesEnum;
  private subscription: Subscription = new Subscription();
  public breakpoint: number = 4;
  public newHomeworkNotifyId: string;

  constructor(
    private homeworksService: HomeworksService,
    private mainService: MainService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    const getAllHomeworks = this.homeworksService.getAllHomeworks().subscribe((hm: HomeworkInterface[]) => {
      if (this.userInfo.role.id === this.userRoles.STUDENT) {
        this.homeworksList = hm.filter((h: HomeworkInterface) => h.students.find(s => s.id === this.userInfo.id));
      } else if (this.userInfo.role.id === this.userRoles.PARENT) {
        this.homeworksList = hm.filter((h: HomeworkInterface) => h.students.find(s => s.id === this.userInfo.myKid.id))
      } else {
        this.homeworksList = hm;
      }
      this.sortHomeworks(this.homeworksList);
    });
    this.breakpoint = (window.innerWidth <= 1200) ? 1 : 4;
    this.router.queryParams.subscribe((params: Params) => {
      console.log('params', params);
      this.newHomeworkNotifyId = params.newHomework;
    })
    this.subscription.add(getAllHomeworks);
  }
  public studentNames(homework: HomeworkInterface): string {
    return homework.students.map(s => s.name).join(', ');
  }

  public youTubeGetID(url: any): string {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  public likeHomework(homeworkId: string) {
    const like = this.homeworksService.like(this.userInfo.id, homeworkId).subscribe((response: HomeworkInterface) => {
      this.homeworksList.filter((homework: HomeworksModel) => {
        if(homework.id === response.id) {
          homework.likes = response.likes;
        }
        return homework;
      });
    });
    this.subscription.add(like);
  }

  public deleteHomework(homeworkId: string) {
    const deleteHomework = this.homeworksService.deleteHomework(homeworkId).subscribe((response: any) => {
      if(response.result === 'ok') {
        this.homeworksList = this.homeworksList.filter((homework: HomeworksModel) => homework.id !== homeworkId);
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.HOMEWORK_CREATED'), '', {
          duration: 4000,
          panelClass: ['success']
        })
      }
    });
    this.subscription.add(deleteHomework);
  }
  public onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 4;
  }
  private sortHomeworks(homeworks: HomeworkInterface[]) {
    homeworks = homeworks.sort((a, b) => {
      let aDate = new Date(a.createdDate).getTime();
      let bDate = new Date(b.createdDate).getTime();
      return bDate - aDate;
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
