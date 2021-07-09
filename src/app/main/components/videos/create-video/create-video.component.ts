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
  private userRoles = UserRolesEnum;
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
      url: ['', [Validators.required]],
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
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.VIDEO_CREATED'), '', {
        duration: 2000,
        panelClass: ['success']
      });
     }
    });
    this.subscription.add(createPostSub);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
