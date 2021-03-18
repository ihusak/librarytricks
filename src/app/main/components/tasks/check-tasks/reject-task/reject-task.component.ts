import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { ProfileService } from '../../../profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reject-task',
  templateUrl: './reject-task.component.html',
  styleUrls: ['./reject-task.component.scss']
})
export class RejectTaskComponent {
  public stundetInfo: StudentInfoInterface;
  public rejectReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<RejectTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public student: StudentInfoInterface,
    private snackBar: MatSnackBar,
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
    this.profileService.changeCurrentTask(userCurrentTask, this.stundetInfo.id).subscribe(() => {
      this.snackBar.open(`Вы отправили назад на тренировку ${this.stundetInfo.userName}`, '', {
        duration: 2000,
        panelClass: ['error']
      });
      this.dialogRef.close();
    });
  }

}
