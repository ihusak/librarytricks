import { UserInfoInterface } from '../interface/user-info.interface';

export class UserInfoModel implements UserInfoInterface {
  userImg: string | File;
  userName: string;
  email: string;
  aboutMe: string;
  bestTrick: string;
  socialNetworks: {
    facebook: string,
    instagram: string
  };
  phone: string;
  startTraining: Date;
  parent: {
    name: string,
    email: string,
    phone: string
  };
  group: {
    id: number;
    name: string;
  };
  file?: File;
  level: number;
  position: number;
  progress: number;

  constructor(responseObj: any) {
    this.userImg = responseObj.userImg;
    this.userName = responseObj.userName;
    this.email = responseObj.email;
    this.aboutMe = responseObj.aboutMe;
    this.bestTrick = responseObj.bestTrick;
    this.socialNetworks = {
      facebook: responseObj.facebook,
      instagram: responseObj.instagram
    };
    this.phone = responseObj.phone;
    this.startTraining = new Date(responseObj.startTraining);
    this.parent = {
      name: responseObj.parentName,
      email: responseObj.parentEmail,
      phone: responseObj.parentPhone
    };
    this.group = {
      id: responseObj.group ? responseObj.group.id : null,
      name: responseObj.group ? responseObj.group.name : '',
    };
    this.level = responseObj.group.level,
    this.position = responseObj.group.position,
    this.progress = responseObj.group.progress;
  }
}