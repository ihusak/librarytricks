import { Component, OnInit } from '@angular/core';
import { TaskService } from '../tasks.service';
import { TaskModel } from '../task.model';
import { MainService } from 'src/app/main/main.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../profile/profile.service';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { MatDialog } from '@angular/material/dialog';
import { PassTaskComponent } from '../popups/pass-task/pass-task.component';
import { ProcessTasksComponent } from '../popups/process-tasks/process-tasks.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public panelOpenState = false;
  public tasksList: TaskModel[];
  public groupsList;
  public currentGroup;
  public userInfo: UserInfoInterface;
  public userRoles = UserRolesEnum;
  public processingTasks: number = 0;
  public pendingTasks: number = 0;
  public doneTasks: number = 0;
  public taskStatuses = TaskStatuses;
  public processingTasksData = [];

  constructor(
    private taskService: TaskService,
    private mainService: MainService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {
      this.userInfo = this.mainService.userInfo;
    }

  ngOnInit() {
    this.getGroups();
    this.getAllTasks();
  }

  public assignTask(task: TaskModel) {
    task.status = TaskStatuses.PROCESSING;
    this.profileService.changeCurrentTask(task, this.userInfo.id).subscribe((updatedUserInfo: UserInfoInterface) => {
      this.userInfo = updatedUserInfo;
      this.snackBar.open('Вы начали выполнение задания', '', {
        duration: 2000,
        panelClass: ['success']
      });
    });
  }

  private getAllTasks(groupId?: number) {
    this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      this.tasksList = tasks.filter((task: TaskModel) => task.group.id === this.currentGroup.id);
    });
  }

  private getTasksStatuses(groupId: number) {
    this.profileService.getUserInfoByCoach(this.userInfo.id).subscribe((usersInfo: UserInfoInterface[]) => {
      this.processingTasks = 0;
      this.pendingTasks = 0;
      this.doneTasks = 0;
      this.processingTasksData = [];
      usersInfo.map((info: UserInfoInterface) => {
        if (info.group.id === groupId) {
          switch (info.currentTask.status) {
            case TaskStatuses.PROCESSING:
              this.processingTasksData.push(info);
              this.processingTasks += 1;
              break;
            case TaskStatuses.PENDING:
              this.pendingTasks += 1;
              break;
            case TaskStatuses.DONE:
              this.doneTasks += 1;
              break;
          }
        }
      });
    });
  }

  // private getPendingTasks(groupId: number) {
  //   this.pendingTasks = 0;
  //   if (this.userInfo.role.id === this.userRoles.COACH) {
  //     this.taskService.getStatusTasks(this.userInfo.id, groupId, this.taskStatuses.PENDING).subscribe((tasks: any[]) => {
  //      tasks.map(task => {
  //       if (task.taskStatus === TaskStatuses.PENDING) {
  //         this.pendingTasks += 1;
  //       }
  //      });
  //     });
  //   }
  // }

  private getGroups() {
    this.taskService.getAllGroups().subscribe((allGroups: any[]) => {
      this.groupsList = allGroups;
      if(this.userInfo.group && this.userInfo.group.id) {
        this.currentGroup = allGroups.filter((group) => group.id === this.userInfo.group.id)[0];
      } else {
        // default group for admin adn coach
        this.currentGroup = allGroups[0];
      }
      this.getTasksStatuses(this.currentGroup.id);
      // this.getPendingTasks(this.currentGroup.id);
    });
  }

  public passTask(task: TaskModel) {
    const dialogRef = this.dialog.open(PassTaskComponent, {
      width: '650px',
      data: {task, userInfo: this.userInfo}
    });
  }

  public viewProcessingTasks() {
    const dialogRef = this.dialog.open(ProcessTasksComponent, {
      width: '650px',
      data: this.processingTasksData
    });
  }

  public changeGroup(group) {
    const groupId: number = group.id;
    this.getAllTasks(groupId);
    this.getTasksStatuses(groupId);
    // this.getPendingTasks(groupId);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  public youTubeGetID(url: any): string {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
 }
  public deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(deletedTask => {
      this.snackBar.open('Задание успешно удалено', '', {
        duration: 2000,
        panelClass: ['success']
      });
      this.ngOnInit();
    })
  }
}
