import { CoachInfoInterface } from '../interface/user-info.interface';

export class UserCoachModel {
  id: string;
  nickName: string;
  userImg: string | File;
  userName: string;
  email: string;
  aboutMe: string;
  socialNetworks: {
    facebook: string,
    instagram: string
  };
  phone: string;
  startTraining: Date;
  bestTrick: string;

  constructor(responseObj: any) {
    this.id = responseObj.id;
    this.nickName = responseObj.nickName;
    this.userImg = responseObj.userImg;
    this.userName = responseObj.userName;
    this.email = responseObj.email;
    this.aboutMe = responseObj.aboutMe;
    this.startTraining = responseObj.startTraining;
    this.bestTrick = responseObj.bestTrick;
    this.socialNetworks = {
      facebook: responseObj.facebook ? responseObj.facebook : '',
      instagram: responseObj.instagram ? responseObj.instagram : ''
    };
    this.phone = responseObj.phone;
  }
}