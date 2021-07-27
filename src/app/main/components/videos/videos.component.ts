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
  public userInfo: any;
  public notApproved: VideoInterface[] = [];
  public mobile: boolean = false;
  constructor(
    private videosService: VideosService,
    public dialog: MatDialog,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.videosService.getAllVideos().subscribe((res: any) => {
      this.videosList = res;
      this.notApproved = this.videosList.filter( video => 
        (!video.verified && (this.userInfo.id === video.createdBy.id) || 
        (!video.verified && this.userInfo.role.id === this.userRoles.ADMIN)));
    });
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.mobile = true;
    }else{
      this.mobile = false;
    }
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
    this.videosService.verifyPost(video.id).subscribe((res: any) => {
      if (res.ok) {
        const notification: NotifyInterface = {
          users: [{id: video.createdBy.id}],
          author: {
            id: video.createdBy.id,
            name: video.createdBy.name
          },
          title: 'TEMPLATE.VIDEOS.TITLE',
          type: this.notifyTypes.NEW_VIDEO,
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
}
