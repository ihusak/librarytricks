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
  public pendingTasksData: StudentInfoInterface[];
  public marks: marksInterface[] = MARKS;
  public coachMark: number = 0;
  public resultMark: number = 0;
  private notifyTypes = NotificationTypes;
  private userRoles = UserRolesEnum;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private profileService: ProfileService,
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
    const getUserInfoByCoach = this.profileService.getUserInfoByCoach(this.userInfo.id).subscribe((usersInfo: StudentInfoInterface[]) => {
      this.pendingTasksData = [];
      usersInfo.map((info: StudentInfoInterface) => {
        if (info.currentTask.status === TaskStatuses.PENDING) {
          this.pendingTasksData.push(info);
        }
      });
    });
    this.subscription.add(getUserInfoByCoach);
  }
  public changeMark(userInfo: StudentInfoInterface) {
    this.resultMark = userInfo.currentTask.reward * (this.coachMark / 100);
  }

  public acceptTask(studentInfo: StudentInfoInterface) {
    const task = {
      taskId: studentInfo.currentTask.id,
      coachId: studentInfo.coach.id,
      reward: studentInfo.currentTask.reward * (this.coachMark / 100),
      courseId: studentInfo.course.id
    };
    const acceptStudentTask = this.profileService.acceptStudentTask(studentInfo.id, task).subscribe(res => {
      this.ngOnInit();
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.ACCEPT_STUDENT_TASK', {student: studentInfo.userName}), '', {
        duration: 2000,
        panelClass: ['success']
      });
      const notification: NotifyInterface = {
        users: [{id: studentInfo.id}],
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'COMMON.UPDATES',
        type: this.notifyTypes.CONFIRM_PASS_TASK,
        userType: [this.userRoles.STUDENT],
        task: {
          id: studentInfo.currentTask.id,
          name: studentInfo.currentTask.title
        },
        course: {
          id: studentInfo.course.id,
          name: studentInfo.course.name
        }
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
    });
    this.subscription.add(acceptStudentTask);
  }

  public reject(studentInfo: StudentInfoInterface) {
    const dialogRef = this.dialog.open(RejectTaskComponent, {
      width: '650px',
      data: studentInfo
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
