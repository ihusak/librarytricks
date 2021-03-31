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
  course: {
    id: string,
    name: string;
  };
  status?: string;
  coach: {
    id: string,
    name: string
  };
  reviewExample: string;
  rejectReason?: string;
  done?: boolean;
  constructor(responseObj: any) {
    this.id = responseObj.id;
    this.title = responseObj.title;
    this.description = responseObj.description;
    this.example = responseObj.example;
    this.allow = responseObj.allow;
    this.reward = responseObj.reward;
    this.rejectReason = responseObj.rejectReason;
    if (typeof responseObj.nextTask === 'string') {
      this.nextTask = {
        id: responseObj.nextTask ? responseObj.nextTask : 'initial'
      };
    } else {
      this.nextTask = {
        id: responseObj.nextTask ? responseObj.nextTask.id : 'initial'
      };
    }
    this.course = {
      id: responseObj.course.id,
      name: responseObj.course.name
    };
  }
}