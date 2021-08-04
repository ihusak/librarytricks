import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { ProfileService } from './profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStudentModel } from 'src/app/shared/models/user-student.model';
import { UserParentModel } from 'src/app/shared/models/user-parent.model';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';
import { TaskService } from '../tasks/tasks.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../shared/enums/notification-types.enum';
import {MainService} from '../../main.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public previewUrl: any = '../../assets/user-default.png';
  public previewUrlChange: boolean = false;
  public coachCourses: any[] = [];
  public coachCourseList: any[] = [];
  public fileData: File = null;
  public initForm: boolean = false;
  public userCourse;
  public coachsList: any;
  public userInfo: FormGroup;
  public userRoles = UserRolesEnum;
  public userInfoData: any;
  private notifyTypes = NotificationTypes;
  public kidsList;
  public coach: any = null;
  private subscription: Subscription = new Subscription();

  @ViewChild('formImgHidden',  {static: false}) formImgHidden: ElementRef;

  constructor(
    private mainService: MainService,
    private profileService: ProfileService,
    private taskService: TaskService,
    protected appService: AppService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {
      this.dateAdapter.setLocale('ru');
  }

  ngOnInit() {
    const userInfoSubject = this.appService.userInfoSubject.subscribe((data: any) => {
      this.userInfoData = data;
      this.switchValidatorsOnRole(this.userInfoData.role.id, data);
      if (data.userImg) {
        this.previewUrl = 'api/' + data.userImg;
      }

    }, err => {
      console.log('userInfo err', err);
    });
    this.subscription.add(userInfoSubject);
  }
  public addInfo() {
    let userInfo;
    switch(this.userInfoData.role.id) {
      case this.userRoles.STUDENT:
        userInfo = new UserStudentModel(this.userInfo.value);
        break;
      case this.userRoles.PARENT:
        userInfo = new UserParentModel(this.userInfo.value);
        break;
      case this.userRoles.COACH:
      userInfo = new UserCoachModel(this.userInfo.value);
      break;
    }
    const formData = new FormData();
    if (this.fileData) {
      formData.append('avatar', this.fileData)
    }
    formData.append('userInfo', JSON.stringify(userInfo));
    console.log(userInfo);
    const updateUserInfo = this.profileService.updateUserInfo(formData).subscribe((updateUser: any) => {
      this.appService.userInfoSubject.next(updateUser);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.USERINFO_UPDATED'), '', {
        duration: 2000,
        panelClass: ['success']
      });
      const notification: NotifyInterface = {
        users: null,
        author: {
          id: this.userInfo.value.id,
          name: this.userInfo.value.userName
        },
        title: 'COMMON.UPDATES',
        type: this.notifyTypes.UPDATE_PROFILE,
        userType: [this.userRoles.ADMIN]
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
    });
    this.subscription.add(updateUserInfo);
  }

  private switchValidatorsOnRole(userRole: number, data) {
    switch (userRole) {
      case this.userRoles.STUDENT:
        this.userCourse = data.course;
        const getAllCourses = this.taskService.getAllCourses().subscribe((allCourses: any[]) => {
          this.coachCourseList = allCourses;
          this.coach = data.coach.id ? data.coach : null;
          if(this.coach) {
            this.changeCoach(data.coach);
          }
        });
        this.subscription.add(getAllCourses);
        const getAllCoaches = this.profileService.getAllCoaches(this.userRoles.COACH).subscribe(coaches => {
          this.coachsList = coaches;
        });
        this.subscription.add(getAllCoaches);
        this.userInfo = this.formBuilder.group({
          nickName: data.nickName || '',
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [data.startTraining ? new Date(data.startTraining) : '', [Validators.required]],
          birthDay: [data.birthDay ? new Date(data.birthDay) : '', [Validators.required]],
          aboutMe: [data.aboutMe || ''],
          course: [data.course, [Validators.required]],
          coach: [data.coach || '', [Validators.required]],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          bestTrick: [data.bestTrick || ''],
          parentName: [data.parent.name || '', [Validators.required]],
          parentPhone: [data.parent.phone || '', [Validators.required]],
          parentEmail: [data.parent.email || '', [Validators.required, Validators.email]],
        });
        this.initForm = true;
        break;
      case this.userRoles.COACH:
        this.userInfo = this.formBuilder.group({
          nickName: data.nickName || '',
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [data.startTraining ? new Date(data.startTraining) : '', [Validators.required]],
          aboutMe: [data.aboutMe || ''],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          bestTrick: [data.bestTrick || '']
        });
        this.initForm = true;
        break;
      case this.userRoles.PARENT:
      const getAllStudents = this.profileService.getAllStudents().subscribe(result => {
        this.userInfo = this.formBuilder.group({
          nickName: data.nickName || '',
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          aboutMe: [data.aboutMe || ''],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          myKid: [Array.isArray(data.myKid) ? data.myKid : [data.myKid] || '', [Validators.required]],
        });
        this.kidsList = result;
        this.initForm = true;
      });
      this.subscription.add(getAllStudents);
      break;
    }
  }

  public changeCoach(value: any, op?: boolean) {
    this.coach = value;
    this.coachCourses = [...this.coachCourseList];
    if(op) {
      this.userInfo.controls.course.setValue('');
    }
    this.coachCourses = this.coachCourses.filter((course: any) => {
      // return this.coach.id === course.coachId || course.forAll; // include general courses
      return this.coach.id === course.coachId; // not include general courses
    });
  }

  public changeCourse(course: any) {
    const coach = this.coachsList.find(coach => course.coachId === coach.id)
    this.userInfo.controls.coach.setValue({
      id: coach.id,
      userName: coach.userName
    })
  }

  compareObjectsCourse(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
  compareObjectsKids(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o2 === o2;
  }

  compareObjectsCoach(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.WRONG_FILE_FORMAT'), '', {
        duration: 4000,
        panelClass: ['error']
      })
      this.previewUrl = '../../assets/user-default.png';
      this.previewUrlChange = false;
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrlChange = true;
      this.userInfo.controls['userImg'].markAsDirty();
      this.previewUrl = reader.result;
    };
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
