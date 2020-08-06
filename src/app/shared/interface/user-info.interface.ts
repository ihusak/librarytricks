export interface UserInfoInterface {
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
  startTraining: Date | string;
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
  currentTask?: {
    id: string,
    status: string,
    reward: number
  }
};