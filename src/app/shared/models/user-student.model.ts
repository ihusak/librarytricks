export class UserStudentModel {
  id: string;
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
  role?: {
    id: number,
    title: string,
    status: boolean
  };
  coach: {
    id: string,
    name: string
  };

  constructor(responseObj: any) {
    this.id = responseObj.id;
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
    this.coach = {
      id: responseObj.coach.id,
      name: responseObj.coach.name
    };
  }
}