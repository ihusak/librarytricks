import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'src/app/main/main.service';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import { RejectTaskComponent } from './reject-task/reject-task.component';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../../shared/enums/notification-types.enum';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {TitleService} from '../../../../shared/title.service';
import {TaskService} from '../tasks.service';
import {TaskStatusInterface} from '../../../../shared/interface/task-status.interface';
import {TaskModel} from '../task.model';

interface marksInterface {
  value: number;
  title: string;
}

const MARKS: marksInterface[] = [
  {value: 20, title: 'BAD'},
  {value: 40, title: 'GOOD'},
  {value: 60, title: 'NOT_BAD'},
  {value: 80, title: 'WOW'},
  {value: 100, title: 'PERFECT'},
]

@Component({
  selector: 'app-check-tasks',
  templateUrl: './check-tasks.component.html',
  styleUrls: ['./check-tasks.component.scss']
})
export class CheckTasksComponent implements OnInit, OnDestroy {
  public userInfo;
  public pendingTasksData: TaskStatusInterface[];
  public marks: marksInterface[] = MARKS;
  public coachMark: number = 0;
  public resultMark: number = 0;
  private notifyTypes = NotificationTypes;
  private userRoles = UserRolesEnum;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private profileService: ProfileService,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private titleService: TitleService,
    public dialog: MatDialog) {
      this.userInfo = mainService.userInfo;
    }

  ngOnInit() {
    this.getPendingTasks();
  }
  private getPendingTasks() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.TASK_LIST.COACH.REVIEW_TASKS.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    const getAllTasksSubj = this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      const getUserInfoByCoach = this.taskService.getTaskStatusesByCoach(this.userInfo.id).subscribe((taskStatuses: TaskStatusInterface[]) => {
        this.pendingTasksData = [];
        taskStatuses.map((info: TaskStatusInterface) => {
          if (info.status === TaskStatuses.PENDING) {
            info.taskInfo = tasks.find((task: TaskModel) => info.taskId === task.id);
            this.pendingTasksData.push(info);
          }
        });
        console.log(this);
      });
      this.subscription.add(getUserInfoByCoach);
    });
    this.subscription.add(getAllTasksSubj);
  }
  public changeMark(data: TaskStatusInterface) {
    this.resultMark = data.taskInfo.reward * (this.coachMark / 100);
  }

  public acceptTask(data: TaskStatusInterface) {
    data.taskInfo.reward = data.taskInfo.reward * (this.coachMark / 100);
    // deprecated
    const acceptStudentTask = this.profileService.acceptStudentTask(data.userId, data.taskInfo).subscribe(res => {
      this.ngOnInit();
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.ACCEPT_STUDENT_TASK', {student: ''}), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: [{id: data.userId}],
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'COMMON.UPDATES',
        type: this.notifyTypes.CONFIRM_PASS_TASK,
        userType: [this.userRoles.STUDENT],
        task: {
          id: data.taskInfo.id,
          name: data.taskInfo.title
        },
        course: {
          id: data.taskInfo.course.id,
          name: data.taskInfo.course.name
        }
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
    });
    this.subscription.add(acceptStudentTask);
  }

  public reject(data: TaskStatusInterface) {
    const dialogRef = this.dialog.open(RejectTaskComponent, {
      width: '650px',
      data
    });
    dialogRef.afterClosed().subscribe((flag) => {
      if (flag) {
        this.ngOnInit();
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
