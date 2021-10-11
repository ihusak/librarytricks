import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { ProfileService } from '../../../profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../../../shared/interface/notify.interface';
import {MainService} from '../../../../main.service';
import {NotificationTypes} from '../../../../../shared/enums/notification-types.enum';
import {UserRolesEnum} from '../../../../../shared/enums/user-roles.enum';

@Component({
  selector: 'app-reject-task',
  templateUrl: './reject-task.component.html',
  styleUrls: ['./reject-task.component.scss']
})
export class RejectTaskComponent implements OnDestroy {
  public userInfo: any;
  public studentInfo: StudentInfoInterface;
  public rejectReason: string = '';
  private notifyTypes = NotificationTypes;
  private userRoles = UserRolesEnum;
  private subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<RejectTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public student: StudentInfoInterface,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private mainService: MainService,
    private profileService: ProfileService) {
      this.studentInfo = student;
      this.userInfo = this.mainService.userInfo;
    }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  reject(reason: string) {
    const userCurrentTask = this.studentInfo.currentTask;
    userCurrentTask.status = TaskStatuses.PROCESSING;
    userCurrentTask.rejectReason = reason;
    // deprecated
    const changeCurrentTask = this.profileService.changeCurrentTask(userCurrentTask, this.studentInfo.id).subscribe(() => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.STUDENT_MOVED_IN_PROGRESS',
        {student: this.studentInfo.userName}), '', {
        duration: 2000,
        panelClass: ['error'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: [{id: this.studentInfo.id}],
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'COMMON.COURSE',
        type: this.notifyTypes.REJECT_TASK,
        userType: [this.userRoles.STUDENT],
        task: {
          id: userCurrentTask.id,
          name: userCurrentTask.title
        }
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
      this.dialogRef.close(true);
    });
    this.subscription.add(changeCurrentTask);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
