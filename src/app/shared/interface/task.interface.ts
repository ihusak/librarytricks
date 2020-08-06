export interface TaskInterface {
  title: string;
  description: string;
  example: string;
  allow: boolean;
  reward: number;
  nextTask: {id: string};
  group: {
    id: number,
    name: string,
  };
};