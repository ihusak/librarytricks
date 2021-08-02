import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/main/main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { ProfileService } from '../../profile/profile.service';
import { HomeworksModel } from '../homeworks.model';
import { HomeworksService } from '../homeworks.service';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../../shared/enums/notification-types.enum';

@Component({
  selector: 'app-update-homework',
  templateUrl: './update-homework.component.html',
  styleUrls: ['./update-homework.component.scss']
})
export class UpdateHomeworkComponent implements OnInit, OnDestroy {
  public hmForm: FormGroup;
  public initForm: boolean = false;
  public userInfo: any;
  public studentList: StudentInfoInterface[];
  public selectedStudents: {id: string, name: string}[];
  private userRoles = UserRolesEnum;
  private notifyTypes = NotificationTypes;
  private hmId: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private homeworksService: HomeworksService,
    private snackBar: MatSnackBar,
    private location: Location,
    private activateRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {
    activateRoute.params.subscribe(params => {
      this.hmId = params.id;
    });
   }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    const getHomeworkById = this.homeworksService.getHomeworkById(this.hmId).subscribe((homework: HomeworksModel) => {
    this.hmForm = this.formBuilder.group({
      title: [homework.title, [Validators.required]],
      description: [homework.description, [Validators.required, Validators.maxLength(250)]],
      example: [homework.example, [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
      students: [homework.students, [Validators.required]],
      id: [homework.id]
    });
    this.selectedStudents = homework.students;
    this.hmForm.controls.students.setValue(this.selectedStudents );
    this.initForm = true;
    const getAllStudents = this.profileService.getAllStudents().subscribe((allStudents: StudentInfoInterface[]) => {
      this.studentList = allStudents;
    });
    this.subscription.add(getAllStudents);
    });
    this.subscription.add(getHomeworkById);
  }

  compareStudents(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o2 === o2;
    // return o1.userName === o2.name && o1._id === o2.id;
  }
  public updateHomework() {
    const HOMEWORK = this.hmForm.value;
    if(!HOMEWORK.createdBy && this.userInfo.role.id !== this.userRoles.ADMIN) {
      HOMEWORK.createdBy = {};
      HOMEWORK.createdBy.id = this.userInfo.id;
      HOMEWORK.createdBy.name = this.userInfo.userName;
    }
    HOMEWORK.students = HOMEWORK.students.map((st: StudentInfoInterface) => ({id: st.id, name: st.userName}));
    const updateHomework = this.homeworksService.updateHomework(this.hmId, HOMEWORK).subscribe((res: any) => {
      if (res.result === 'ok') {
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.TASK_UPDATED'), '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.location.back();
      }
    });
    const notification: NotifyInterface = {
      users: HOMEWORK.students,
      author: {
        id: this.userInfo.id,
        name: this.userInfo.userName
      },
      title: 'COMMON.HOMEWORKS',
      type: this.notifyTypes.HOMEWORK_UPDATE,
      userType: [this.userRoles.STUDENT, this.userRoles.PARENT],
      homework: {
        id: HOMEWORK.id,
        name: HOMEWORK.title
      }
    };
    this.mainService.setNotification(notification).subscribe((res: any) => {})
    this.subscription.add(updateHomework);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
