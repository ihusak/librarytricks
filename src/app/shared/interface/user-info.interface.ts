import { TaskModel } from 'src/app/main/components/tasks/task.model'

export interface StudentInfoInterface {
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
    id: string;
    name: string;
  };
  rating: number;
  progress: number;
  role: {
    id: number,
    title: string,
    status: boolean
  };
  currentTask?: TaskModel;
  coach: {
    id: string,
    name: string
  };
  doneTasks: string[];
};

export interface CoachInfoInterface {
  id: string;
  userImg: string;
  userName: string;
  email: string;
  aboutMe: string;
  bestTrick: string;
  phone: string;
  socialNetworks: {
    facebook: string,
    instagram: string
  };
  role: {
    id: number;
    name: string;
    status: boolean;
  };
  startTraining?: Date | string;
}

export interface ParentInfoInterface {
  id: string;
  userImg: string;
  userName: string;
  email: string;
  aboutMe: string;
  socialNetworks: {
    facebook: string;
    instagram: string;
  };
  phone: string;
  myChild: {
    id: string;
    name: string;
  };
  role: {
    id: number;
    name: string;
    status: boolean;
  };
  startTraining?: Date | string;
};

export interface AdminInfoInterface {
  id: string;
  userImg: string;
  userName: string;
  email: string;
  phone: string;
  role: {
    id: number;
    name: string;
    status: boolean;
  };
  startTraining?: Date | string;
}
