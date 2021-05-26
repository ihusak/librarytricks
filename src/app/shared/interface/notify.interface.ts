export interface NotifyInterface {
  id?: string;
  users: [
    {
      id: string
    }
  ];
  title: string;
  description: string;
  userType: number;
}
