import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { ProfileService } from '../../../profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reject-task',
  templateUrl: './reject-task.component.html',
  styleUrls: ['./reject-task.component.scss']
})
export class RejectTaskComponent implements OnDestroy {
  public stundetInfo: StudentInfoInterface;
  public rejectReason: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<RejectTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public student: StudentInfoInterface,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private profileService: ProfileService) {
      this.stundetInfo = student;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  reject(reason: string) {
    const userCurrentTask = this.stundetInfo.currentTask;
    userCurrentTask.status = TaskStatuses.PROCESSING;
    userCurrentTask.rejectReason = reason;
    const changeCurrentTask = this.profileService.changeCurrentTask(userCurrentTask, this.stundetInfo.id).subscribe(() => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.STUDENT_MOVED_IN_PROGRESS', {student: this.stundetInfo.userName}), '', {
        duration: 2000,
        panelClass: ['error']
      });
      this.dialogRef.close();
    });
    this.subscription.add(changeCurrentTask);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
