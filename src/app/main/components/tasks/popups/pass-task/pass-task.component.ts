import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { TaskModel } from '../../task.model';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {TaskService} from '../../tasks.service';
import {TaskStatusInterface} from '../../../../../shared/interface/task-status.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    private taskService: TaskService,
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
    const taskStatus: TaskStatusInterface = {
      status: TaskStatuses.PENDING,
      taskId: this.task.id,
      coachId: this.userInfo.coach.id,
      userId: this.userInfo.id,
      reject: this.task.rejectReason,
      reviewExample: this.reviewExample
    };
    const changeCurrentTask = this.taskService.changeTaskStatus(taskStatus).subscribe((updatedUserInfo: StudentInfoInterface) => {
      this.userInfo = updatedUserInfo;
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.TASK_SENT_TO_REVIEW'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.dialogRef.close(true);
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
