import {UserRolesEnum} from '../enums/user-roles.enum';

export interface NotifyInterface {
  _id?: string;
  author: {
    id: string;
    name: string;
  };
  users: [
    {
      id: string
    }
  ] | null;
  title: string;
  type: string;
  userType: UserRolesEnum[];
  course?: {
    id: string;
    name: string;
  };
}
