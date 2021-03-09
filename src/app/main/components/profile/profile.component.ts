import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
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
  public kidsList;
  public coach: any = null;

  @ViewChild('formImgHidden',  {static: false}) formImgHidden: ElementRef;

  constructor(
    private profileService: ProfileService,
    private taskService: TaskService,
    protected appService: AppService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder
  ) {
      this.dateAdapter.setLocale('ru');
  }
  ngAfterViewInit() {
    console.log(this.userInfo);

  }

  ngOnInit() {
    this.appService.userInfoSubject.subscribe((data: any) => {
      this.userInfoData = data;
      this.switchValidatorsOnRole(this.userInfoData.role.id, data);
      if (data.userImg) {
        this.previewUrl = 'api/' + data.userImg;
      }
      console.log(this.userInfo.valid);

    }, err => {
      console.log('userInfo err', err);
    });
  }
  ngOnDestroy() {
    console.log('profile destroy');
    // this.appService.userInfoSubject.unsubscribe();
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
    console.log(userInfo, this.userInfo.value);
    this.profileService.updateUserInfo(formData).subscribe((updateUser: any) => {
      this.appService.userInfoSubject.next(updateUser);
      console.log(updateUser);
      this.snackBar.open('Сохранено', '', {
        duration: 2000,
        panelClass: ['success']
      })
    });
  }

  private switchValidatorsOnRole(userRole: number, data) {
    switch (userRole) {
      case this.userRoles.STUDENT:
        this.userCourse = data.course;
        this.taskService.getAllCourses().subscribe((allCourses: any[]) => {
          this.coachCourseList = allCourses;
          this.coach = data.coach.id ? data.coach : null;
          if(this.coach) {
            this.changeCoach(data.coach);
          }
        });
        this.profileService.getAllCoaches(this.userRoles.COACH).subscribe(coaches => {
          this.coachsList = coaches;
        });
        this.userInfo = this.formBuilder.group({
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [new Date(data.startTraining) || '', [Validators.required]],
          aboutMe: [data.aboutMe || ''],
          course: [data.course, [Validators.required]],
          coach: [data.coach || '', [Validators.required]],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          bestTrick: [data.bestTrick || '', [Validators.required]],
          parentName: [data.parent.name || '', [Validators.required]],
          parentPhone: [data.parent.phone || '', [Validators.required]],
          parentEmail: [data.parent.email || '', [Validators.required, Validators.email]],
        });
        this.initForm = true;
        break;
      case this.userRoles.COACH:
        this.userInfo = this.formBuilder.group({
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [new Date(data.startTraining) || '', [Validators.required]],
          aboutMe: [data.aboutMe || ''],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          bestTrick: [data.bestTrick || '', [Validators.required]]
        });
        this.initForm = true;
        break;
      case this.userRoles.PARENT:
      this.profileService.getAllStudents().subscribe(result => {
        this.userInfo = this.formBuilder.group({
          userImg: data.userImg || '',
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          aboutMe: [data.aboutMe || ''],
          instagram: [data.socialNetworks.instagram || ''],
          facebook: [data.socialNetworks.facebook || ''],
          myKid: [data.myKid || '', [Validators.required]],
        });
        this.kidsList = result;
        this.initForm = true;
      });
      break;
    }
    console.log(this);
  }

  public changeCoach(value: any) {
    this.coach = value;
    this.coachCourses = [...this.coachCourseList];
    this.coachCourses = this.coachCourses.filter((course: any) => {
      // return this.coach.id === course.coachId || course.forAll; // include general courses
      return this.coach.id === course.coachId; // not include general courses
    });
  }

  public changeCourse(course: any) {
    console.log(this);
    const coach = this.coachsList.find(coach => course.coachId === coach.id)
    this.userInfo.controls.coach.setValue({
      id: coach.id,
      userName: coach.userName
    })
  }

  compareObjects(o1: any, o2: any): boolean {
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
    console.log(this.formImgHidden);
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.snackBar.open('Не првельный формат файла, должен быть (PNG, JPG, JPEG, GIF)', '', {
        duration: 4000,
        panelClass: ['error']
      })
      console.log('FORMAT NOT IMG');
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
    }
  }
}
