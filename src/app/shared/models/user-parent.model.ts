export class UserParentModel {
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
  myKid: {
    id: string,
    name: string
  }

  constructor(responseObj: any) {
    this.id = responseObj.id;
    this.userImg = responseObj.userImg;
    this.userName = responseObj.userName;
    this.email = responseObj.email;
    this.aboutMe = responseObj.aboutMe;
    this.socialNetworks = {
      facebook: responseObj.facebook,
      instagram: responseObj.instagram
    };
    this.phone = responseObj.phone;
    this.myKid = {
      id: responseObj.myKid.id,
      name: responseObj.myKid.name
    }
  }
}