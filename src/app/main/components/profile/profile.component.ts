import { Component, OnInit, OnDestroy} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MainService } from '../../main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { ProfileService } from './profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStudentModel } from 'src/app/shared/models/user-student.model';
import { UserParentModel } from 'src/app/shared/models/user-parent.model';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  // public userInfo: any;
  // public previewUrl;
  // private observerUserInfoData: Subscription;
  // public userRoles = UserRolesEnum;
  public previewUrl: any = '../../assets/user-default.png';
  public userGroups;
  public fileData: File = null;
  public initForm: boolean = false;
  public userGroup;
  public coachsList: any;
  public userInfo: FormGroup;
  public userRoles = UserRolesEnum;
  public userInfoData: any;
  public kidsList;
  private roleId: number;

  constructor(
    private profileService: ProfileService,
    protected appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder
  ) {
      this.dateAdapter.setLocale('ru');
      this.roleId = this.appService.getUserRole();
  }

  ngOnInit() {
    this.getUserDetails();
    // this.userInfo = this.mainService.userInfo;
    // this.previewUrl = this.userInfo.userImg ? 'api/' + this.userInfo.userImg : 'assets/user-default.png';
  }
  ngOnDestroy() {
    console.log('profile destroy');
    // if(this.observerUserInfoData) {
    //    this.observerUserInfoData.unsubscribe();
    // }
  }
  getUserDetails() {
    this.profileService.getUserInfo().subscribe((data: any) => {
      this.userInfoData = data;
      this.switchValidatorsOnRole(this.userInfoData.role.id, data);
      if (data.userImg) {
        this.previewUrl = 'api/' + data.userImg;
      }
    }, err => {
      console.log('userInfo err', err);
    });
  }

  public addInfo() {
    let userInfo;
    const userId = this.appService.getUserId();
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
    this.profileService.updateUserInfo(formData).subscribe((updateUser: string) => {
      this.snackBar.open('Сохранено', '', {
        duration: 2000,
        panelClass: ['success']
      });
      // .then(() => {
      //   window.location.reload();
      // });
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  compareObjectsCoach(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }
  /**
   *
   * @param fileInput File progress
   */
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    // this.uploadImage();
    this.preview();
  }
  preview() {
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  private switchValidatorsOnRole(userRole: number, data) {
    switch (userRole) {
      case this.userRoles.STUDENT:
        this.userGroup = data.group;
        this.profileService.getAllGroups().subscribe(allGroups => {
          this.userGroups = allGroups;
        });
        this.profileService.getAllCoaches(this.userRoles.COACH).subscribe(coaches => {
          this.coachsList = coaches;
        });
        this.userInfo = this.formBuilder.group({
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [data.startTraining || '', [Validators.required]],
          aboutMe: [data.aboutMe || ''],
          group: [{value: data.group || '', disabled: data.progress < 100 && data.currentTask.id}, [Validators.required]],
          coach: [{value: data.coach || '', disabled: data.progress < 100 && data.currentTask.id}, [Validators.required]],
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
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          startTraining: [data.startTraining || '', [Validators.required]],
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
}
