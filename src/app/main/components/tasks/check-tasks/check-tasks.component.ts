import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'src/app/main/main.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';

@Component({
  selector: 'app-check-tasks',
  templateUrl: './check-tasks.component.html',
  styleUrls: ['./check-tasks.component.scss']
})
export class CheckTasksComponent implements OnInit {
  public userInfo;
  public pendingTasksData: UserInfoInterface[];

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
    this.profileService.getUserInfoByCoach(this.userInfo.id).subscribe((usersInfo: UserInfoInterface[]) => {
      this.pendingTasksData = [];
      usersInfo.map((info: UserInfoInterface) => {
        if (info.currentTask.status === TaskStatuses.PENDING) {
          this.pendingTasksData.push(info);
        }
      });
    });
  }

  public acceptTask(userInfo: UserInfoInterface) {
    const task = {
      taskId: userInfo.currentTask.id,
      coachId: userInfo.coach.id,
      reward: userInfo.currentTask.reward,
      groupId: userInfo.group.id
    }
    this.profileService.acceptUserTask(userInfo.id, task).subscribe(res => {
      console.log(res);
    })
  }

  public reject(user) {
    console.log('reject', user);
  }
}
