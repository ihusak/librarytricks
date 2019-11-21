import { IndexComponent } from './components/index/index.component';
import { MainGuardService } from './guards/main.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MainComponent } from './main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { VideosComponent } from './components/videos/videos.component';
import { ProgressComponent } from './components/progress/progress.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { RatingsComponent } from './components/ratings/ratings.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: 'index', component: IndexComponent},
    {path: 'profile', loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule)},
    {path: 'progress', component: ProgressComponent},
    {path: 'videos', component: VideosComponent},
    {path: 'tasks', component: TasksComponent},
    {path: 'ratings', component: RatingsComponent}
  ]},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found'}
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule {

}