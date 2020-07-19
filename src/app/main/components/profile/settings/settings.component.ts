import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { AppService } from 'src/app/app.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { UserInfoModel } from 'src/app/shared/models/userInfo.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material';

const GROPUS = [{
  id: 1,
  name: 'beginner'
},
{
  id: 2,
  name: 'middle'
},
{
  id: 3,
  name: 'master'
}];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public previewUrl: any = '../../assets/user-default.png';
  public userGroups = GROPUS;
  public fileData: File = null;
  public initForm: boolean = false;
  public userGroup;
  public userInfo: FormGroup = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    email: new FormControl({value: '', disabled: true}, [Validators.required]),
    startTraining: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    aboutMe: new FormControl(''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
    bestTrick: new FormControl('', [Validators.required]),
    parentName: new FormControl('', [Validators.required]),
    parentPhone: new FormControl('', [Validators.required]),
    parentEmail: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private profileService: ProfileService,
    protected appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dateAdapter: DateAdapter<Date>
    ) {
      this.dateAdapter.setLocale('ru');
    }

  ngOnInit() {
    this.getUserDetails();
    console.log('userID', this.appService.userID);
  }
  getUserDetails() {
    const userId = this.appService.getUserId();
    this.profileService.getUserInfo(userId).subscribe((data: UserInfoInterface) => {
      this.initForm = true;
      this.appService.setUserInfoData(data);
      this.userGroup = data.group;
      this.userInfo.setValue({
        phone: data.phone || '',
        userName: data.userName || '',
        email: data.email || '',
        startTraining: data.startTraining ? new Date(data.startTraining) : new Date(),
        aboutMe: data.aboutMe || '',
        group: data.group || '',
        instagram: data.socialNetworks.instagram || '',
        facebook: data.socialNetworks.facebook || '',
        bestTrick: data.bestTrick || '',
        parentName: data.parent.name || '',
        parentPhone: data.parent.phone || '',
        parentEmail: data.parent.email || ''
      });
      if (data.userImg) {
        this.previewUrl = 'api/' + data.userImg;
      }
    }, err => {
      console.log('userInfo err', err);
    });
  }

  public addInfo() {
    const userId = this.appService.getUserId();
    const userInfo = new UserInfoModel(this.userInfo.value);
    const formData = new FormData();
    if (this.fileData) {
      formData.append('avatar', this.fileData)
    }
    formData.append('userInfo', JSON.stringify(userInfo));
    this.profileService.updateUserInfo(userId, formData).subscribe((updateUser: string) => {
      const data = JSON.parse(updateUser);
      this.appService.setUserInfoData(data);
      this.snackBar.open('Сохранено', '', {
        duration: 2000,
        panelClass: ['success']
      });
      this.router.navigate(['main/profile/overview']);
    });
  }

  // public selectUserType(groupId: number) {
  //   const group = GROPUS.filter(group => group.id === groupId)[0];
  //   this.userInfo.get('group').setValue(group);
  //   this.userGroup = group;
  //   console.log(this.userInfo, this.userGroup);
  // }

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
}
