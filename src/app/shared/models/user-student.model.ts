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
  course: {
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
    this.course = {
      id: responseObj.course ? responseObj.course.id : null,
      name: responseObj.course ? responseObj.course.name : '',
    };
    this.level = responseObj.course.level,
    this.position = responseObj.course.position,
    this.progress = responseObj.course.progress;
    this.coach = {
      id: responseObj.coach.id,
      name: responseObj.coach.userName
    };
  }
}