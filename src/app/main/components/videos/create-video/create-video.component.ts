import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotifyInterface } from 'src/app/shared/interface/notify.interface';
import { NotificationTypes } from 'src/app/shared/enums/notification-types.enum';
import {MatDialogRef} from '@angular/material/dialog';
import {VideosService} from '../videos.service';

@Component({
  selector: 'app-create-homework',
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.scss']
})
export class CreateVideoComponent implements OnInit, OnDestroy {
  public videoForm: FormGroup;
  public initForm: boolean = false;
  public userInfo: any;
  public userRoles = UserRolesEnum;
  private notifyTypes = NotificationTypes;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private location: Location,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<CreateVideoComponent>,
    private videosService: VideosService
  ) {}

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.videoForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gm)]],
      description: [''],
      author: [{
        id: this.userInfo.id,
        name: this.userInfo.userName
      }, Validators.required]
    });
    this.initForm = true;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public create() {
    const VIDEO = this.videoForm.value;
    const createPostSub = this.videosService.createPost(VIDEO).subscribe((createdVideo: any) => {
    this.dialogRef.close(createdVideo);
    if (createdVideo) {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.VIDEO_MOVED_TO_VERIFICATION'), '', {
        duration: 5000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: null,
        author: {
          id: createdVideo.createdBy.id,
          name: createdVideo.createdBy.name
        },
        title: 'COMMON.VIDEOS',
        type: this.notifyTypes.VERIFY_VIDEO,
        userType: [this.userRoles.ADMIN]
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
     }
    });
    this.subscription.add(createPostSub);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
