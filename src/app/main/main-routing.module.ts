import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MainComponent } from './main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { VideosComponent } from './components/videos/videos.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { HomeworksComponent } from './components/homeworks/homeworks.component';
import { VersionsComponent } from './components/versions/versions.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'profile', loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule)},
    {path: 'videos', component: VideosComponent},
    {path: 'tasks', loadChildren: () => import('./components/tasks/tasks.module').then(m => m.TasksModule)},
    {path: 'ratings', component: RatingsComponent},
    {path: 'payments', component: PaymentsComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'homeworks', loadChildren: () => import('./components/homeworks/homeworks.module').then(m => m.HomeworksModule)},
    {path: 'privacy', component: PrivacyPolicyComponent},
    {path: 'versions', component: VersionsComponent}
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
