export interface NotifyInterface {
  id?: string;
  users: [
    {
      id: string
    }
  ];
  title: string;
  description: string;
  type: string;
  hasNotify: boolean;
}