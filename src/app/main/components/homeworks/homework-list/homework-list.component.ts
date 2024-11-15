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
import { TitleService } from 'src/app/shared/title.service';

interface SortItemInterface {
  name: string;
  key: string;
  id?: string;
}

enum sortingValues {
  POPULAR = 'popular',
  NEW = 'new',
  OLD = 'old',
  AUTHOR = 'author'
}

@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.scss']
})
export class HomeworkListComponent implements OnInit, OnDestroy {
  public homeworksList: HomeworkInterface[];
  private defaultSort = [
    {name: sortingValues.NEW, key: sortingValues.NEW},
    {name: sortingValues.POPULAR, key: sortingValues.POPULAR},
    {name: sortingValues.OLD, key: sortingValues.OLD}
  ];
  public userInfo: any;
  public userRoles = UserRolesEnum;
  private subscription: Subscription = new Subscription();
  public breakpoint: number = 4;
  private notifyTypes = NotificationTypes;
  public newHomeworkNotifyId: string;
  public sort = {
    currentSort: null,
    sortList: [],
    query: '',
    allHomeworks: [],
    sortedItems: [],
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
    private router: ActivatedRoute,
    private titleService: TitleService
  ) {
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('COMMON.HOMEWORKS').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.userInfo = this.mainService.userInfo;
    const getAllHomeworks = this.homeworksService.getAllHomeworks().subscribe((hm: HomeworkInterface[]) => {
      if (this.userInfo.role.id === this.userRoles.STUDENT) {
        this.homeworksList = hm.filter((h: HomeworkInterface) => h.students.find(s => s.id === this.userInfo.id));
      } else if (this.userInfo.role.id === this.userRoles.PARENT) {
        this.homeworksList = hm.filter((h: HomeworkInterface) => h.students.find(s => s.id === this.userInfo.myKid.id))
      } else {
        this.homeworksList = hm;
      }
      this.prepareSort(hm);
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
        if (homework.id === response.id) {
          homework.likes = response.likes;
        }
        return homework;
      });
    });
    this.subscription.add(like);
  }

  public deleteHomework(homework: HomeworkInterface) {
    const deleteHomework = this.homeworksService.deleteHomework(homework.id).subscribe((response: any) => {
      if (response.result === 'ok') {
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
  public searchQueryDescription(query: string): HomeworkInterface[] {
    const sortingItems = this.sort.allHomeworks;
    this.sort.currentSort = this.sort.sortList[0];
    if (!query && this.matPaginator) {
      this.homeworksList = sortingItems.slice(this.matPaginator.pageIndex * this.matPaginator.pageSize,
        this.matPaginator.pageIndex * this.matPaginator.pageSize + this.matPaginator.pageSize);
      this.sort.length = this.homeworksList.length;
      return;
    }
    this.homeworksList = sortingItems.filter((homework: HomeworkInterface) => {
      return homework.description && homework.description.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    }).slice(this.matPaginator.pageIndex * this.matPaginator.pageSize,
      this.matPaginator.pageIndex * this.matPaginator.pageSize + this.matPaginator.pageSize);
    this.sort.length = this.homeworksList.length;
    return this.homeworksList;
  }
  public changeSort(sort: SortItemInterface): HomeworkInterface[] {
    const sortingItems = this.sort.allHomeworks;
    this.sort.query = '';
    switch (sort.key) {
      case sortingValues.AUTHOR:
        this.homeworksList = sortingItems.filter((homework: HomeworkInterface) => homework.createdBy && homework.createdBy.id === sort.id);
        this.sort.length = this.homeworksList.length;
        break;
      case sortingValues.NEW:
        this.homeworksList = sortingItems.sort((a: HomeworkInterface, b: HomeworkInterface) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this.sort.length = this.homeworksList.length;
        break;
      case sortingValues.OLD:
        this.homeworksList = sortingItems.sort((a: HomeworkInterface, b: HomeworkInterface) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        this.sort.length = this.homeworksList.length;
        break;
      case sortingValues.POPULAR:
        this.homeworksList = sortingItems.sort((a: HomeworkInterface, b: HomeworkInterface) => b.likes.length - a.likes.length);
        this.sort.length = this.homeworksList.length;
        break;
    }
    return this.homeworksList;
  }
  public checkPermission(homework: HomeworkInterface): boolean {
    if (this.userInfo.role.id !== this.userRoles.ADMIN &&
        this.userInfo.id === (homework.createdBy && homework.createdBy.id) ||
        !homework.createdBy) {
      return true;
    }
    return false;
  }
  public onPageChange($event) {
    const sortingItems = this.sort.allHomeworks;
    this.homeworksList = sortingItems.slice($event.pageIndex * $event.pageSize,
    $event.pageIndex * $event.pageSize + $event.pageSize);
  }
  private prepareSort(homework: HomeworkInterface[]) {
    this.sort.allHomeworks = homework;
    const AUTHORS = homework.filter((h: HomeworkInterface) => h.createdBy).map((h: HomeworkInterface) => ({
      name: h.createdBy.name,
      id: h.createdBy.id,
      key: sortingValues.AUTHOR
    })).filter((hm, index, self) => index === self.findIndex((i) => hm.id === i.id));
    this.sort.sortList = [...this.defaultSort, ...AUTHORS];
    this.sort.currentSort = this.defaultSort[0];
    this.sort.length = this.sort.allHomeworks.length;
    this.changeSort(this.sort.currentSort);
    // init page size of available items
    this.homeworksList = this.sort.allHomeworks.slice(0, this.paginationOptions.pageSize);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
