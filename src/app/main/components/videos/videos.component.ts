import { Component, OnInit } from '@angular/core';
import {UserRolesEnum} from '../../../shared/enums/user-roles.enum';
import {VideoInterface, VideosService} from './videos.service';
import {NotifyInterface} from '../../../shared/interface/notify.interface';
import {MatDialog} from '@angular/material/dialog';
import {CreateVideoComponent} from './create-video/create-video.component';
import {NotificationTypes} from '../../../shared/enums/notification-types.enum';
import {MainService} from '../../main.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  public userRoles = UserRolesEnum;
  public videosList: VideoInterface[] = [];
  private notifyTypes = NotificationTypes;
  constructor(
    private videosService: VideosService,
    public dialog: MatDialog,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.videosService.getAllVideos().subscribe((res: any) => {
      this.videosList = res;
    });
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
            id: video.author.id,
            name: video.author.userName
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
}
