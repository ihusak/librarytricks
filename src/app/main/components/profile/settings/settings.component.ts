import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { AppService } from 'src/app/app.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { UserStudentModel } from 'src/app/shared/models/user-student.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { UserParentModel } from 'src/app/shared/models/user-parent.model';
import { UserCoachModel } from 'src/app/shared/models/user-coach.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public previewUrl: any = '../../assets/user-default.png';
  public userGroups;
  public fileData: File = null;
  public initForm: boolean = false;
  public userGroup;
  public coachsList: any;
  public userInfo: FormGroup;
  public userRoles = UserRolesEnum;
  public userInfoData: UserInfoInterface;
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
  }
  getUserDetails() {
    const userId = this.appService.getUserId();
    this.profileService.getUserInfo(userId, this.roleId).subscribe((data: UserInfoInterface) => {
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
    console.log(this.userInfo.value);
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
    this.profileService.updateUserInfo(userId, formData, this.roleId).subscribe((updateUser: string) => {
      // this.appService.setUserInfoData(updateUser);
      this.snackBar.open('Сохранено', '', {
        duration: 2000,
        panelClass: ['success']
      });
      this.router.navigate(['main/profile/overview'])
      // .then(() => {
      //   window.location.reload();
      // });
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
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
          console.log('all group', allGroups);
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
          group: [data.group || '', [Validators.required]],
          coach: [data.coach || '', [Validators.required]],
          instagram: [data.instagram || ''],
          facebook: [data.facebook || ''],
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
          instagram: [data.instagram || ''],
          facebook: [data.facebook || ''],
          bestTrick: [data.bestTrick || '', [Validators.required]]
        });
        this.initForm = true;
        break;
      case this.userRoles.PARENT:
      this.profileService.getAllStudents(this.userRoles.STUDENT).subscribe(result => {
        console.log(result);
        this.userInfo = this.formBuilder.group({
          phone: [data.phone || '', [Validators.required]],
          userName: [data.userName || '', [Validators.required]],
          email: [{value: data.email || '', disabled: true}, [Validators.required, Validators.email]],
          aboutMe: [data.aboutMe || ''],
          instagram: [data.instagram || ''],
          facebook: [data.facebook || ''],
          myKid: [data.myKid || '', [Validators.required]],
        });
        this.kidsList = result;
        this.initForm = true;
      });
      break;
    }
  }
}
