import { Component, OnInit } from '@angular/core';
import {UserRolesEnum} from '../../../shared/enums/user-roles.enum';
import {VideoInterface, VideosService} from './videos.service';
import {NotifyInterface} from '../../../shared/interface/notify.interface';
import {MatDialog} from '@angular/material/dialog';
import {CreateVideoComponent} from './create-video/create-video.component';
import {NotificationTypes} from '../../../shared/enums/notification-types.enum';
import {MainService} from '../../main.service';

const SOCIAL_NETWORKS = [
  'instagram',
  'youtube',
  'tiktok'
];

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  public userRoles = UserRolesEnum;
  public videosList: VideoInterface[] = [];
  private notifyTypes = NotificationTypes;
  public userRole = UserRolesEnum;
  public userInfo: any;
  public notApproved: boolean = false;
  constructor(
    private videosService: VideosService,
    public dialog: MatDialog,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.videosService.getAllVideos().subscribe((res: any) => {
      this.videosList = res;
      this.notApproved = res.find( video => !video.verified && this.userInfo.id === video.createdBy.id);
    });
    console.log(this);
  }
  public createPost() {
    const dialogRef = this.dialog.open(CreateVideoComponent, {
      width: '650px'
    });
    dialogRef.afterClosed().subscribe(video => {
      if (video) {
        const notification: NotifyInterface = {
          users: null,
          author: {
            id: video.createdBy.id,
            name: video.createdBy.userName
          },
          title: 'TEMPLATE.VIDEOS.TITLE',
          type: this.notifyTypes.NEW_VIDEO,
          userType: [this.userRoles.STUDENT, this.userRoles.PARENT, this.userRoles.COACH, this.userRoles.ADMIN]
        };
        this.mainService.setNotification(notification).subscribe((res: any) => {});
        video.id = video._id;
        delete video._id;
        this.videosList.push(video);
      }
    });
  }
  public likeVideo(video: VideoInterface) {
    this.videosService.likePost(video.id).subscribe((res: VideoInterface) => {
      if (res) {
        this.videosList.map((v: VideoInterface) => {
          if (v.id === res.id) {
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
    let result;
    SOCIAL_NETWORKS.map((type: string) => {
      const regex = new RegExp(type, 'gi');
      if (regex.exec(url)) {
        result = type;
      }
    });
    return 'fa-' + result;
  }
  public verifyVideo(video: VideoInterface) {
    this.videosService.verifyPost(video.id).subscribe((res: any) => {
      if (res.ok) {
        this.videosList.map((v: VideoInterface) => {
          if (v.id === video.id) {
            v.verified = true;
          }
          return v;
        });
      }
    });
  }
}
