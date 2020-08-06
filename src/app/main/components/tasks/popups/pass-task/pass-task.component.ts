import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from '../../task.model';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { ProfileService } from '../../../profile/profile.service';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pass-task',
  templateUrl: './pass-task.component.html',
  styleUrls: ['./pass-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PassTaskComponent implements OnInit {
  public task: TaskModel;
  public userInfo: UserInfoInterface;
  public reviewExample: string;

  constructor(
    public dialogRef: MatDialogRef<PassTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {task: TaskModel, userInfo: UserInfoInterface},
    private profileService: ProfileService,
    private snackBar: MatSnackBar
    ) {
      this.task = data.task;
      this.userInfo = data.userInfo;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  request() {
    this.task.status = TaskStatuses.PENDING;
    this.task.reviewExample = this.reviewExample;
    this.profileService.changeCurrentTask(this.task, this.userInfo.id).subscribe((updatedUserInfo: UserInfoInterface) => {
      this.userInfo = updatedUserInfo;
      this.snackBar.open('Ты сдал задание на проверку, ожидай результат', '', {
        duration: 2000,
        panelClass: ['success']
      });
    });
    this.dialogRef.close();
  }

}
