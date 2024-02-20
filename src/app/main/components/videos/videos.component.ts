import { Component, OnInit, ViewChild } from '@angular/core';
import {UserRolesEnum} from '../../../shared/enums/user-roles.enum';
import {VideoInterface, VideosService} from './videos.service';
import {NotifyInterface} from '../../../shared/interface/notify.interface';
import {MatDialog} from '@angular/material/dialog';
import {CreateVideoComponent} from './create-video/create-video.component';
import {NotificationTypes} from '../../../shared/enums/notification-types.enum';
import {MainService} from '../../main.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { TitleService } from 'src/app/shared/title.service';

const SOCIAL_NETWORKS = [
  'instagram',
  'youtube',
  'tiktok'
];
interface SortItemInterface {
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

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  public userRoles = UserRolesEnum;
  private defaultSort =  [
    {name: sortingValues.NEW, key: sortingValues.NEW},
    {name: sortingValues.POPULAR, key: sortingValues.POPULAR},
    {name: sortingValues.OLD, key: sortingValues.OLD}
  ];
  public videosList: VideoInterface[] = [];
  private notifyTypes = NotificationTypes;
  public userInfo: any;
  public notApproved: VideoInterface[] = [];
  public mobile: boolean = false;
  public sort = {
    currentSort: null,
    sortList: [],
    query: '',
    allVideos: [],
    approvedVideos: [],
    notApprovedVideos: []
  };
  public paginationOptions = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25]
  };
  private subscription: Subscription = new Subscription();
  @ViewChild('matPaginator', {static: false}) matPaginator: MatPaginator;
  constructor(
    private videosService: VideosService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private mainService: MainService,
    private titleService: TitleService
  ) {
    this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.VIDEOS.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.userInfo = this.mainService.userInfo;
    const getAllVideos = this.videosService.getAllVideos().subscribe((res: []) => {
      this.prepareSort(res);
    });
    this.subscription.add(getAllVideos);
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
    const likePost = this.videosService.likePost(video.id).subscribe((res: any) => {
      if (res) {
        this.videosList.map((v: VideoInterface) => {
          if (v.id === res._id) {
            v.likes = res.likes;
          }
          return v;
        });
      }
    });
    this.subscription.add(likePost);
  }
  public deleteVideo(video: VideoInterface) {
    const deletePost = this.videosService.deletePost(video.id).subscribe((res: any) => {
      if (res.ok) {
        this.videosList = this.videosList.filter((v: VideoInterface) => v.id !== video.id);
      }
    });
    this.subscription.add(deletePost);
  }
  public getImage(url: string): string {
    const result = SOCIAL_NETWORKS.find((type: string) => {
      const regex = new RegExp(type, 'gi');
      return !!regex.exec(url);
    });
    return result ? `fab fa-${result}` : `fas fa-question`;
  }
  public verifyVideo(video: VideoInterface) {
    const verifyPost = this.videosService.verifyPost(video.id, video.createdBy.id).subscribe((res: any) => {
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
    this.subscription.add(verifyPost);
  }
  changeSort(sort: SortItemInterface) {
    this.sort.query = '';
    switch (sort.key) {
      case sortingValues.AUTHOR:
        this.videosList = this.sort.allVideos.filter((video: VideoInterface) => video.createdBy.id === sort.id);
        break;
      case sortingValues.NEW:
        this.videosList = this.sort.allVideos.sort((a: VideoInterface, b: VideoInterface) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case sortingValues.OLD:
        this.videosList = this.sort.allVideos.sort((a: VideoInterface, b: VideoInterface) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        break;
      case sortingValues.POPULAR:
        this.videosList = this.sort.allVideos.sort((a: VideoInterface, b: VideoInterface) => b.likes.length - a.likes.length);
        break;
      case sortingValues.NOT_APPROVED:
        this.videosList = this.sort.allVideos.filter((video: VideoInterface) => !video.verified);
        break;
    }
  }
  searchQueryDescription(query: string) {
    this.sort.currentSort = this.sort.sortList[0];
    if (!query) {
      this.videosList = this.sort.approvedVideos.slice(this.matPaginator.pageIndex * this.matPaginator.pageSize,
        this.matPaginator.pageIndex * this.matPaginator.pageSize + this.matPaginator.pageSize);;
      return;
    }
    this.videosList = this.sort.approvedVideos.filter((video: VideoInterface) => {
      return video.description && video.description.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    }).slice(this.matPaginator.pageIndex * this.matPaginator.pageSize,
      this.matPaginator.pageIndex * this.matPaginator.pageSize + this.matPaginator.pageSize);
  }
  onPageChange($event) {
    this.videosList = this.sort.approvedVideos.slice($event.pageIndex * $event.pageSize,
    $event.pageIndex * $event.pageSize + $event.pageSize);
  }
  onPageNotApprovedChange($event) {
    this.notApproved = this.sort.notApprovedVideos.slice($event.pageIndex * $event.pageSize,
    $event.pageIndex * $event.pageSize + $event.pageSize);
  }
  private prepareSort(videos: []) {
    const AUTHORS = videos.map((post: any) => ({
      name: post.createdBy.name,
      id: post.createdBy.id,
      key: sortingValues.AUTHOR
    })).filter((post, index, self) => index === self.findIndex((i) => post.id === i.id));
    this.sort.allVideos = videos;
    this.sort.approvedVideos = videos.filter((video: any) => video.verified);
    this.notApproved = videos.filter((video: any) =>
      (!video.verified && (this.userInfo.id === video.createdBy.id) ||
        (!video.verified && this.userInfo.role.id === this.userRoles.ADMIN)));
    this.sort.sortList = [...this.defaultSort, ...AUTHORS];
    this.sort.notApprovedVideos = [...this.notApproved];
    this.sort.currentSort = this.defaultSort[0];
    this.changeSort(this.sort.currentSort);
    // init page size of available items
    this.videosList = this.sort.approvedVideos.slice(0, this.paginationOptions.pageSize);
    this.notApproved = this.sort.notApprovedVideos.slice(0, this.paginationOptions.pageSize);
  }
}
