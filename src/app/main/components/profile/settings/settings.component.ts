import { Component, OnInit } from '@angular/core';
import { SettingService } from './settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public model;
  public previewUrl: any = '../../assets/user-default.png';
  fileData: File = null;
  userInfo: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    startTraining: new FormControl('', [Validators.required]),
    aboutMe: new FormControl(''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
    bestTrick: new FormControl('', [Validators.required]),
    parentName: new FormControl('', [Validators.required]),
    parentPhone: new FormControl('', [Validators.required]),
    parentEmail: new FormControl('', [Validators.required, Validators.email])
  });
  initForm: boolean = false;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getUserDetails();
    console.log('userInfo', this.userInfo);
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    console.log(this.fileData);
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
  addInfo() {
    this.settingService.addInfo(this.userInfo.value);
  }
  getUserDetails() {
    this.settingService.getUserInfo().subscribe( doc => {
      const data = doc.data();
      this.initForm = true;
      this.userInfo.setValue({
        userName: data.userName || null,
        phone: data.phone || null,
        email: data.email || null,
        startTraining: new Date(data.startTraining.seconds * 1000) || null,
        aboutMe: data.aboutMe || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        bestTrick: data.bestTrick || null,
        parentName: data.parentName || null,
        parentPhone: data.parentPhone || null,
        parentEmail: data.parentEmail || null
      })
    })
    // console.log(this.settingService.getUserInfo());
  }

}
