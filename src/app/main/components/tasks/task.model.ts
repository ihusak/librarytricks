export class TaskModel {
  id: string;
  title: string;
  description: string;
  example: string;
  allow?: boolean;
  reward: number;
  nextTask?: {
    id: string
  };
  group: {
    id: number,
    name: string;
  };
  status?: string;
  coach: {
    id: string,
    name: string
  };
  reviewExample: string;
  constructor(responseObj: any) {
    this.id = responseObj._id;
    this.title = responseObj.title;
    this.description = responseObj.description;
    this.example = responseObj.example;
    this.allow = responseObj.allow;
    this.reward = responseObj.reward;
    if (typeof responseObj.nextTask === 'string') {
      this.nextTask = {
        id: responseObj.nextTask ? responseObj.nextTask : 'initial'
      };
    } else {
      this.nextTask = {
        id: responseObj.nextTask ? responseObj.nextTask.id : 'initial'
      };
    }
    this.group = {
      id: responseObj.group.id,
      name: responseObj.group.name
    };
  }
}