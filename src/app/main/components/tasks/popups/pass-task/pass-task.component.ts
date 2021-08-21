import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from '../../task.model';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { ProfileService } from '../../../profile/profile.service';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const YOUTUBE_REGEXP = new RegExp('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$');

@Component({
  selector: 'app-pass-task',
  templateUrl: './pass-task.component.html',
  styleUrls: ['./pass-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PassTaskComponent implements OnInit, OnDestroy {
  public task: TaskModel;
  public userInfo: StudentInfoInterface;
  public reviewExample: string;
  private subscription: Subscription = new Subscription();
  public valid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PassTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {task: TaskModel, userInfo: StudentInfoInterface},
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
    ) {
      this.task = data.task;
      this.userInfo = data.userInfo;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  request() {
    this.task.status = TaskStatuses.PENDING;
    this.task.reviewExample = this.reviewExample;
    const changeCurrentTask = this.profileService.changeCurrentTask(this.task, this.userInfo.id).subscribe((updatedUserInfo: StudentInfoInterface) => {
      this.userInfo = updatedUserInfo;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.TASK_SENT_TO_REVIEW'), '', {
        duration: 2000,
        panelClass: ['success']
      });
    });
    this.subscription.add(changeCurrentTask);
    this.dialogRef.close(true);
  }
  public validUrl(url: string) {
    if(url && YOUTUBE_REGEXP.exec(url)) {
      this.valid = true;
    } else {
      this.valid = false;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
