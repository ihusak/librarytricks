import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { QuillModule } from 'ngx-quill';
import { HomeworksRoutingModule } from './homeworks-routing.module';
import { HomeworkListComponent } from './homework-list/homework-list.component';
import { HomeworksComponent } from './homeworks.component';
import { CreateHomeworkComponent } from './create-homework/create-homework.component';

@NgModule({
  declarations: [
    HomeworksComponent,
    HomeworkListComponent,
    CreateHomeworkComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    SharedModule,
    HomeworksRoutingModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    QuillModule.forRoot()
  ],
  entryComponents: [HomeworkListComponent]
})
export class HomeworksModule {

}
