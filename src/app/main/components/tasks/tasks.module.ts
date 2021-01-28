import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { TaskService } from './tasks.service';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { CheckTasksComponent } from './check-tasks/check-tasks.component';
import { PassTaskComponent } from './popups/pass-task/pass-task.component';
import { ProcessTasksComponent } from './popups/process-tasks/process-tasks.component';
import { RejectTaskComponent } from './check-tasks/reject-task/reject-task.component';
import { CreateGroupComponent } from './popups/create-group/create-group/create-group.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    TasksComponent,
    CreateTaskComponent,
    TaskListComponent,
    UpdateTaskComponent,
    CheckTasksComponent,
    PassTaskComponent,
    ProcessTasksComponent,
    RejectTaskComponent,
    CreateGroupComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    SharedModule,
    TasksRoutingModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    QuillModule.forRoot()
  ],
  entryComponents: [PassTaskComponent, ProcessTasksComponent, RejectTaskComponent, CreateGroupComponent],
  providers: [TaskService]
})
export class TasksModule {

}
