import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { CheckTasksComponent } from './check-tasks/check-tasks.component';

const routes: Routes = [
    {
        path: '',
        component: TasksComponent,
        children: [
            {path: '', redirectTo: 'task-list', pathMatch: 'full'},
            {path: 'create-task', component: CreateTaskComponent, data: {title: 'TEMPLATE.TASK_LIST.COACH.CREATE_TASK.TITLE', description: 'TEMPLATE.META_TAGS.CREATE_TASK_DESC'}},
            {path: 'task-list', component: TaskListComponent, data: {title: 'COMMON.COURSE', description: 'TEMPLATE.META_TAGS.TASK_LIST_DESC'}},
            {path: 'update-task/:id', component: UpdateTaskComponent, data: {title: 'TEMPLATE.TASK_LIST.COACH.CREATE_TASK.UPDATE_TITLE', description: 'TEMPLATE.META_TAGS.UPDATE_TASK_DESC'}},
            {path: 'check-tasks', component: CheckTasksComponent, data: {title: 'TEMPLATE.TASK_LIST.COACH.REVIEW_TASKS.TITLE', description: 'TEMPLATE.META_TAGS.CHECK_TASK_DESC'}},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksRoutingModule {}
