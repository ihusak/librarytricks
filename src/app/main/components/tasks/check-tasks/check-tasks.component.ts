import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'src/app/main/main.service';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { RejectTaskComponent } from './reject-task/reject-task.component';

interface marksInterface {
  value: number;
  title: string;
}

const MARKS: marksInterface[] = [
  {value: 20, title: 'BAD'},
  {value: 40, title: 'NOT_BAD'},
  {value: 60, title: 'GOOD'},
  {value: 80, title: 'WOW'},
  {value: 100, title: 'PERFECT'},
]

@Component({
  selector: 'app-check-tasks',
  templateUrl: './check-tasks.component.html',
  styleUrls: ['./check-tasks.component.scss']
})
export class CheckTasksComponent implements OnInit {
  public userInfo;
  public pendingTasksData: StudentInfoInterface[];
  public marks: marksInterface[] = MARKS;
  public coachMark: number = 0;
  public resultMark: number = 0;

  constructor(
    private mainService: MainService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
      this.userInfo = mainService.userInfo;
    }

  ngOnInit() {
    this.getPendingTasks();
  }
  private getPendingTasks() {
    this.profileService.getUserInfoByCoach(this.userInfo.id).subscribe((usersInfo: StudentInfoInterface[]) => {
      this.pendingTasksData = [];
      usersInfo.map((info: StudentInfoInterface) => {
        if (info.currentTask.status === TaskStatuses.PENDING) {
          this.pendingTasksData.push(info);
        }
      });
    });
  }
  public changeMark(userInfo: StudentInfoInterface) {
    this.resultMark = userInfo.currentTask.reward * (this.coachMark / 100);
  }

  public acceptTask(userInfo: StudentInfoInterface) {
    const task = {
      taskId: userInfo.currentTask.id,
      coachId: userInfo.coach.id,
      reward: userInfo.currentTask.reward * (this.coachMark / 100),
      groupId: userInfo.group.id
    }
    this.profileService.acceptUserTask(userInfo.id, task).subscribe(res => {
      this.ngOnInit();
      this.snackBar.open(`Вы приняли задания ученика: ${userInfo.userName}`, '', {
        duration: 2000,
        panelClass: ['success']
      });
    })
  }

  public reject(studentInfo: StudentInfoInterface) {
    const dialogRef = this.dialog.open(RejectTaskComponent, {
      width: '650px',
      data: studentInfo
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    })
  }
}
