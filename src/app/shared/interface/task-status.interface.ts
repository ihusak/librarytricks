import {TaskModel} from '../../main/components/tasks/task.model';

export interface TaskStatusInterface {
  status: string;
  taskId: string;
  coachId: string;
  userId: string;
  reject: string;
  reviewExample?: string;
  taskInfo?: TaskModel;
}
