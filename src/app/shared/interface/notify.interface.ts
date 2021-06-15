export interface NotifyInterface {
  id?: string;
  author: {
    id: string;
    name: string;
  },
  users: [
    {
      id: string
    }
  ];
  title: string;
  type: string;
  userType: number;
}
