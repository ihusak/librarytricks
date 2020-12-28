import { CoachInfoInterface } from '../interface/user-info.interface';

export class UserCoachModel {
  id: string;
  userImg: string | File;
  userName: string;
  email: string;
  aboutMe: string;
  socialNetworks: {
    facebook: string,
    instagram: string
  };
  phone: string;

  constructor(responseObj: CoachInfoInterface) {
    this.id = responseObj.id;
    this.userImg = responseObj.userImg;
    this.userName = responseObj.userName;
    this.email = responseObj.email;
    this.aboutMe = responseObj.aboutMe;
    this.socialNetworks = {
      facebook: responseObj.socialNetworks ? responseObj.socialNetworks.facebook : '',
      instagram: responseObj.socialNetworks ? responseObj.socialNetworks.instagram : ''
    };
    this.phone = responseObj.phone;
  }
}