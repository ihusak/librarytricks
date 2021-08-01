import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {UserRolesEnum} from '../../../shared/enums/user-roles.enum';
import {VideoInterface, VideosService} from './videos.service';
import {NotifyInterface} from '../../../shared/interface/notify.interface';
import {MatDialog} from '@angular/material/dialog';
import {CreateVideoComponent} from './create-video/create-video.component';
import {NotificationTypes} from '../../../shared/enums/notification-types.enum';
import {MainService} from '../../main.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material';

const SOCIAL_NETWORKS = [
  'instagram',
  'youtube',
  'tiktok'
];
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
  {name: sortingValues.OLD, key: sortingValues.OLD},
  {name: sortingValues.NOT_APPROVED, key: sortingValues.NOT_APPROVED}
]

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, AfterViewInit {
  public userRoles = UserRolesEnum;
  public videosList: VideoInterface[] = [];
  private notifyTypes = NotificationTypes;
  public userInfo: any;
  public notApproved: VideoInterface[] = [];
  public mobile: boolean = false;
  public sort = {
    currentSortr: '',
    sortList: [],
    query: '',
    values: []
  };
  @ViewChild('matPaginator', {static: false}) matPaginator: MatPaginator;
  constructor(
    private videosService: VideosService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private mainService: MainService,
  ) {
    this.sort.sortList = DEFAULT_SORT.map((sortItem: sortItemInterface) => {
      sortItem.name = translateService.instant('COMMON.SORT.' + sortItem.name.toUpperCase(), '');
      return sortItem;
    });
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.mobile = true;
    }else{
      this.mobile = false;
    }
  }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.videosService.getAllVideos().subscribe((res: []) => {
      const AUTHORS = res.map((post: any) => ({
        name: post.createdBy.name, 
        id: post.createdBy.id,
        key: sortingValues.AUTHOR
      })).filter((post, index, self) => index === self.findIndex((i) => post.id === i.id));
      this.videosList = res;
      this.sort.values = res;
      this.notApproved = this.videosList.filter( video => 
        (!video.verified && (this.userInfo.id === video.createdBy.id) || 
        (!video.verified && this.userInfo.role.id === this.userRoles.ADMIN)));
      this.sort.sortList = [...this.sort.sortList, ...AUTHORS];
    console.log(this.matPaginator);
    });
  }
  ngAfterViewInit() {
    this.matPaginator.initialized.subscribe((e) => {
      console.log(e);
    })
  }
  public createPost() {
    const dialogRef = this.dialog.open(CreateVideoComponent, {
      width: '650px'
    });
    dialogRef.afterClosed().subscribe(video => {
      if (video) {
        this.notApproved.push(video);
      }
    });
  }
  public likeVideo(video: VideoInterface) {
    this.videosService.likePost(video.id).subscribe((res: any) => {
      if (res) {
        this.videosList.map((v: VideoInterface) => {
          if (v.id === res._id) {
            v.likes = res.likes;
          }
          return v;
        });
      }
    })
  }
  public deleteVideo(video: VideoInterface) {
    this.videosService.deletePost(video.id).subscribe((res: any) => {
      if (res.ok) {
        this.videosList = this.videosList.filter((v: VideoInterface) => v.id !== video.id);
      }
    });
  }
  public getImage(url: string): string {
    let result = SOCIAL_NETWORKS.find((type: string) => {
      const regex = new RegExp(type, 'gi');
      return !!regex.exec(url);
    });
    return result ? `fab fa-${result}` : `fas fa-question`;
  }
  public verifyVideo(video: VideoInterface) {
    this.videosService.verifyPost(video.id, video.createdBy.id).subscribe((res: any) => {
      if (res.ok) {
        const notification: NotifyInterface = {
          users: [{id: video.createdBy.id}],
          author: {
            id: video.createdBy.id,
            name: video.createdBy.name
          },
          title: 'COMMON.VIDEOS',
          type: this.notifyTypes.VIDEO_APPROVED,
          userType: [this.userRoles.STUDENT, this.userRoles.PARENT, this.userRoles.COACH, this.userRoles.ADMIN]
        };
        this.mainService.setNotification(notification).subscribe((res: any) => {});
        this.videosList = this.videosList.map((v: VideoInterface) => {
          if (v.id === video.id) {
            v.verified = true;
          }
          return v;
        });
        this.notApproved = this.notApproved.filter((v: VideoInterface) => v.id !== video.id);
      }
    });
  }
  changeSort(sort: sortItemInterface) {
    console.log(sort);
    switch(sort.key) {
      case sortingValues.AUTHOR:
        this.videosList = this.sort.values.filter((video: VideoInterface) => video.createdBy.id === sort.id);
        break;
      case sortingValues.NEW:
        this.videosList = this.sort.values.sort((a: VideoInterface, b: VideoInterface) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case sortingValues.OLD:
        this.videosList = this.sort.values.sort((a: VideoInterface, b: VideoInterface) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        break;
      case sortingValues.POPULAR:
        this.videosList = this.sort.values.sort((a: VideoInterface, b: VideoInterface) => b.likes.length - a.likes.length);
        break;
      case sortingValues.NOT_APPROVED:
        this.videosList = this.sort.values.filter((video: VideoInterface) => !video.verified);
        break;
    }
  }
  searchQueryDescription(query: string) {
    if (!query) {
      this.videosList = this.sort.values;
      return;
    }
    this.videosList = this.sort.values.filter((video: VideoInterface) => {
      return video.description && video.description.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    });
  }
  onPageChange($event) {
    this.videosList =  this.sort.values.slice($event.pageIndex*$event.pageSize,
    $event.pageIndex*$event.pageSize + $event.pageSize);
  }
}
