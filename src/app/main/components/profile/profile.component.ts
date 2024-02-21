import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { ProfileService } from './profile.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UserStudentModel } from 'src/app/shared/models/user-student.model';
import { UserParentModel } from 'src/app/shared/models/user-parent.model';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';
import { TaskService } from '../tasks/tasks.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {NotifyInterface} from '../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../shared/enums/notification-types.enum';
import {MainService} from '../../main.service';
import { TitleService } from 'src/app/shared/title.service';
import { TaskStatuses } from 'src/app/shared/enums/task-statuses.enum';
import {DateAdapter} from '@angular/material/core';

interface KidInterface {
  id: string;
  name: string;
  email: string;
}

interface DynamicChildEmailInterface {
  id: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public previewUrl: any = '../../assets/user-default.png';
  public previewUrlChange: boolean = false;
  public taskStatuses = TaskStatuses;
  public coachCourses: any[] = [];
  public coachCourseList: any[] = [];
  public fileData: File = null;
  public initForm: boolean = false;
  public userCourse;
  public coachList: any;
  public userInfo: FormGroup;
  public userRoles = UserRolesEnum;
  public userInfoData: any;
  private notifyTypes = NotificationTypes;
  public coach: any = null;
  public parentKids: KidInterface[];
  public kidEmailsInput: DynamicChildEmailInterface[] = [];
  public addKidForm: FormGroup = new FormGroup({});
  private sessionInfo: any;
  private allKids: any;
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
    private translateService: TranslateService,
    private titleService: TitleService,
  ) {
      this.dateAdapter.setLocale('ru');
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.PROFILE.PROFILE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.sessionInfo = this.mainService.userInfo;
    const userInfoSubject = this.appService.userInfoSubject.subscribe((data: any) => {
      if (!data) return;
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
    switch (this.userInfoData.role.id) {
      case this.userRoles.STUDENT:
        userInfo = new UserStudentModel(this.userInfo.getRawValue());
        break;
      case this.userRoles.PARENT:
        userInfo = new UserParentModel(this.userInfo.getRawValue());
        break;
      case this.userRoles.COACH:
      userInfo = new UserCoachModel(this.userInfo.getRawValue());
      break;
    }
    const formData = new FormData();
    if (this.fileData) {
      formData.append('avatar', this.fileData)
    }
    formData.append('userInfo', JSON.stringify(userInfo));
    const updateUserInfo = this.profileService.updateUserInfo(formData).subscribe((updateUser: any) => {
      this.appService.userInfoSubject.next(updateUser);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.USERINFO_UPDATED'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: null,
        author: {
          id: userInfo.id,
          name: userInfo.userName
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
          if (this.coach) {
            this.changeCoach(data.coach);
          }
        });
        this.subscription.add(getAllCourses);
        const getAllCoaches = this.profileService.getAllCoaches(this.userRoles.COACH).subscribe(coaches => {
          this.coachList = coaches;
        });
        this.subscription.add(getAllCoaches);
        this.userInfo = this.formBuilder.group({
          nickName: data.nickName || '',
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [{value: data.userName || '', disabled: true}, [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [data.startTraining ? new Date(data.startTraining) : '', [Validators.required]],
          birthDay: [data.birthDay ? new Date(data.birthDay) : '', [Validators.required]],
          aboutMe: [data.aboutMe || ''],
          course: [data.course, [Validators.required]],
          coach: [data.coach || '', [Validators.required]],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          bestTrick: [data.bestTrick || ''],
          parentName: [{value: data.parent.name || '', disabled: !!data.parent.name}, [Validators.required]],
          parentPhone: [{value: data.parent.phone || '', disabled: !!data.parent.phone}, [Validators.required]],
          parentEmail: [{value: data.parent.email || '', disabled: !!data.parent.email}, [Validators.required, Validators.email]],
        });
        this.initForm = true;
        break;
      case this.userRoles.COACH:
        this.userInfo = this.formBuilder.group({
          nickName: data.nickName || '',
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [{value: data.userName || '', disabled: true}, [Validators.required]],
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
        const kids = Array.isArray(data.myKid) ? data.myKid : [data.myKid];
        this.userInfo = this.formBuilder.group({
          nickName: data.nickName || '',
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [{value: data.userName || '', disabled: true}, [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          aboutMe: [data.aboutMe || ''],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          myKid: [kids, [Validators.required]],
        });
        this.parentKids = kids;
        this.allKids = result
        this.initForm = true;
      });
      this.subscription.add(getAllStudents);
      break;
    }
  }

  public changeCoach(value: any, op?: boolean) {
    this.coach = value;
    this.coachCourses = [...this.coachCourseList];
    if (op) {
      this.userInfo.controls.course.setValue('');
    }
    this.coachCourses = this.coachCourses.filter((course: any) => {
      // return this.coach.id === course.coachId || course.forAll; // include general courses
      return this.coach.id === course.coachId; // not include general courses
    });
  }

  public changeCourse(course: any) {
    const coach = this.coachList.find((c: any) => course.coachId === c.id);
    this.userInfo.controls.coach.setValue({
      id: coach.id,
      userName: coach.userName
    });
  }

  compareObjectsCourse(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  compareObjectsCoach(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.WRONG_FILE_FORMAT'), '', {
        duration: 4000,
        panelClass: ['error'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.previewUrl = '../../assets/user-default.png';
      this.previewUrlChange = false;
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrlChange = true;
      this.userInfo.controls['userImg'].markAsDirty();
      this.previewUrl = reader.result;
    };
  }
  public addKid() {
    if (this.kidEmailsInput.length >= 10) {
      return
    }
    const arr = this.kidEmailsInput;
    const controlName = 'kid' + arr.length;
    this.addKidForm.addControl('kid' + (arr.length ? arr.length : '0'), new FormControl('', [Validators.required, Validators.email]));
    this.kidEmailsInput.push({id: controlName});
  }
  public sendInvitation() {
    const emailsToInvite: string[] = Object.values(this.addKidForm.value);
    const checkRepeated = this.allKids.find((kid: any) => !!emailsToInvite.find((email: string) => kid.email === email));
    const user = {
      id: this.sessionInfo.id,
      name: this.sessionInfo.userName,
      email: this.sessionInfo.email,
      roleId: this.sessionInfo.role.id
    };
    if (!checkRepeated) {
      const EMAILS = emailsToInvite.map(email => email.toLowerCase());
      this.profileService.sendInvite(EMAILS, user).subscribe(() => {
          this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.INVITATIONS_SENT', {users: emailsToInvite.join(', ')}), '', {
            duration: 5000,
            panelClass: ['success'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.addKidForm.reset();
          this.kidEmailsInput = [];
      });
    } else {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.EMAIL_EXIST', {userEmail: checkRepeated.email}), '', {
        duration: 5000,
        panelClass: ['error'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
