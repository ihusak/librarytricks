import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {HomeworkInterface, HomeworksService} from '../homeworks.service';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import { HomeworksModel } from '../homeworks.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params } from '@angular/router';
import {NotifyInterface} from '../../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../../shared/enums/notification-types.enum';
import { MatPaginator } from '@angular/material/paginator';

interface sortItemInterface {
  name: string;
  key: string;
  id?: string;
}

enum sortingValues {
  POPULAR = 'popular',
  NEW = 'new',
  OLD = 'old',
  AUTHOR = 'author',
  NOT_APPROVED = 'not_approved'
}

const DEFAULT_SORT: sortItemInterface[] = [
  {name: sortingValues.NEW, key: sortingValues.NEW},
  {name: sortingValues.POPULAR, key: sortingValues.POPULAR},
  {name: sortingValues.OLD, key: sortingValues.OLD}
]

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
  private notifyTypes = NotificationTypes;
  public newHomeworkNotifyId: string;
  public sort = {
    currentSort: {id: '', name: '', key: ''},
    sortList: [],
    query: '',
    allHomeworks: [],
    length: 0
  };
  public paginationOptions = {
    pageSize: 8,
    pageSizeOptions: [4, 8, 12, 24, 48]
  };
  @ViewChild('matPaginator', {static: false}) matPaginator: MatPaginator;

  constructor(
    private homeworksService: HomeworksService,
    private mainService: MainService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: ActivatedRoute
  ) {
    this.sort.sortList = DEFAULT_SORT.map((sortItem: sortItemInterface) => {
      sortItem.name = translateService.instant('COMMON.SORT.' + sortItem.name.toUpperCase(), '');
      return sortItem;
    });
  }

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
      this.sort.allHomeworks = hm;
      const AUTHORS = hm.filter((h: HomeworkInterface) => h.createdBy).map((h: HomeworkInterface) => ({
        name: h.createdBy.name, 
        id: h.createdBy.id,
        key: sortingValues.AUTHOR
      })).filter((homework, index, self) => index === self.findIndex((i) => homework.id === i.id));
      this.sort.sortList = [...this.sort.sortList, ...AUTHORS];
      this.sort.length = this.sort.allHomeworks.length;
      this.homeworksList = this.sort.allHomeworks.slice(0*this.paginationOptions.pageSize,
        0*this.paginationOptions.pageSize + this.paginationOptions.pageSize);
    });
    this.breakpoint = (window.innerWidth <= 1200) ? 1 : 4;
    this.router.queryParams.subscribe((params: Params) => {
      this.newHomeworkNotifyId = params.hmId;
    });
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

  public deleteHomework(homework: HomeworkInterface) {
    const deleteHomework = this.homeworksService.deleteHomework(homework.id).subscribe((response: any) => {
      if(response.result === 'ok') {
        this.homeworksList = this.homeworksList.filter((hm: HomeworksModel) => hm.id !== homework.id);
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.HOMEWORK_CREATED'), '', {
          duration: 4000,
          panelClass: ['success']
        });
        const notification: NotifyInterface = {
          users: null,
          author: {
            id: this.userInfo.id,
            name: this.userInfo.userName
          },
          title: 'COMMON.HOMEWORKS',
          type: this.notifyTypes.HOMEWORK_DELETE,
          userType: [this.userRoles.ADMIN],
          homework: {
            id: homework.id,
            name: homework.title
          }
        };
        this.mainService.setNotification(notification).subscribe((res: any) => {})
      }
    });
    this.subscription.add(deleteHomework);
  }
  public onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 4;
  }
  public searchQueryDescription(query: string) {
    if (!query) {
      this.homeworksList = this.sort.allHomeworks;
      return;
    }
    // if(this.sort.currentSort) {
    //   this.changeSort(this.sort.currentSort);
    // }
    this.homeworksList = this.sort.allHomeworks.filter((homework: HomeworkInterface) => {
      return homework.description && homework.description.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    }).slice(this.matPaginator.pageIndex*this.matPaginator.pageSize,
      this.matPaginator.pageIndex*this.matPaginator.pageSize + this.matPaginator.pageSize);
    this.sort.length = this.homeworksList.length;
  }
  public changeSort(sort: sortItemInterface) {
    switch(sort.key) {
      case sortingValues.AUTHOR:
        this.homeworksList = this.sort.allHomeworks.filter((homework: HomeworkInterface) => homework.createdBy && homework.createdBy.id === sort.id);
        this.sort.length = this.homeworksList.length;
        break;
      case sortingValues.NEW:
        this.homeworksList = this.sort.allHomeworks.sort((a: HomeworkInterface, b: HomeworkInterface) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this.sort.length = this.homeworksList.length;
        break;
      case sortingValues.OLD:
        this.homeworksList = this.sort.allHomeworks.sort((a: HomeworkInterface, b: HomeworkInterface) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        this.sort.length = this.homeworksList.length;
        break;
      case sortingValues.POPULAR:
        this.homeworksList = this.sort.allHomeworks.sort((a: HomeworkInterface, b: HomeworkInterface) => b.likes.length - a.likes.length);
        this.sort.length = this.homeworksList.length;
        break;
    }
  }
  public onPageChange($event) {
    this.homeworksList = this.sort.allHomeworks.slice($event.pageIndex*$event.pageSize,
    $event.pageIndex*$event.pageSize + $event.pageSize);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
