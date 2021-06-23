import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import { ProfileService } from '../../profile/profile.service';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { HomeworksService } from '../homeworks.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotifyInterface } from 'src/app/shared/interface/notify.interface';
import { NotificationTypes } from 'src/app/shared/enums/notification-types.enum';

@Component({
  selector: 'app-create-homework',
  templateUrl: './create-homework.component.html',
  styleUrls: ['./create-homework.component.scss']
})
export class CreateHomeworkComponent implements OnInit, OnDestroy {
  public hmForm: FormGroup;
  public initForm: boolean = false;
  public userInfo: any;
  private userRoles = UserRolesEnum;
  public studentList: StudentInfoInterface[];
  private notifyTypes = NotificationTypes;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private homeworksService: HomeworksService,
    private snackBar: MatSnackBar,
    private location: Location,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.hmForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      example: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
      students: [[], [Validators.required]],
      author: [{
        id: this.userInfo.id,
        name: this.userInfo.userName
      }, Validators.required]
    });
    this.initForm = true;
    const getAllStudents = this.profileService.getAllStudents().subscribe((allStudents: StudentInfoInterface[]) => {
      this.studentList = allStudents;
    });
    this.subscription.add(getAllStudents);
  }
  public createHm() {
    const HOMEWORK = this.hmForm.value;
    HOMEWORK.students = HOMEWORK.students.map((st: StudentInfoInterface) => ({id: st.id, name: st.userName}));
    const createHomework = this.homeworksService.createHomework(HOMEWORK).subscribe(res => {
      if (res) {
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.TASK_CREATED'), '', {
          duration: 2000,
          panelClass: ['success']
        });
        const notification: NotifyInterface = {
          users: HOMEWORK.students,
          author: {
            id: this.userInfo.id,
            name: this.userInfo.userName
          },
          title: 'COMMON.HOMEWORKS',
          type: this.notifyTypes.NEW_HOMEWORK,
          userType: [this.userRoles.STUDENT, this.userRoles.PARENT],
          homework: {
            id: res[0]._id,
            name: res[0].title
          }
        };
        this.mainService.setNotification(notification).subscribe((res: any) => {})
        this.location.back();
      }
    });
    this.subscription.add(createHomework);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
