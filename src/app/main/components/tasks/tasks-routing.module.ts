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
            {path: 'create-task', component: CreateTaskComponent},
            {path: 'task-list', component: TaskListComponent},
            {path: 'update-task/:id', component: UpdateTaskComponent},
            {path: 'check-tasks', component: CheckTasksComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksRoutingModule {}
