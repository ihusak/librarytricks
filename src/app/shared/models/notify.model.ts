export class NotifyModel {
  id: string;
  users: [
    {
      id: string
    }
  ];
  title: string;
  description: string;
  type: string;
  hasNotify: boolean;
  constructor(responseObj: any) {
    this.id = responseObj.id;
    this.users = responseObj.users;
    this.title = responseObj.title;
    this.description = responseObj.description;
    this.type = responseObj.type;
    this.hasNotify = responseObj.hasNotify;
  }
}