import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { QuillModule } from 'ngx-quill';
import { HomeworksRoutingModule } from './homeworks-routing.module';
import { HomeworkListComponent } from './homework-list/homework-list.component';
import { HomeworksComponent } from './homeworks.component';
import { CreateHomeworkComponent } from './create-homework/create-homework.component';
import { HomeworksService } from './homeworks.service';
import { UpdateHomeworkComponent } from './update-homework/update-homework.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomeworksComponent,
    HomeworkListComponent,
    CreateHomeworkComponent,
    UpdateHomeworkComponent
  ],
  imports: [
    SharedModule,
    HomeworksRoutingModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    TranslateModule,
    QuillModule.forRoot()
  ],
  providers: [HomeworksService]
})
export class HomeworksModule {

}
