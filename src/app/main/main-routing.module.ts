import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MainComponent } from './main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { VideosComponent } from './components/videos/videos.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { VersionsComponent } from './components/versions/versions.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';
import { ShopComponent } from './components/shop/shop.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: 'dashboard', component: DashboardComponent, data: {title: 'COMMON.DASHBOARD', description: 'TEMPLATE.META_TAGS.DASHBOARD_DESC'}},
    {path: 'profile', loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule)},
    {path: 'videos', component: VideosComponent, data: {title: 'TEMPLATE.VIDEOS.TITLE', description: 'TEMPLATE.META_TAGS.VIDEO_DESC'}},
    {path: 'tasks', loadChildren: () => import('./components/tasks/tasks.module').then(m => m.TasksModule)},
    {path: 'payments', component: PaymentsComponent, data: {title: 'COMMON.PAYMENT', description: 'TEMPLATE.META_TAGS.PAYMENT_DESC'}},
    {path: 'about-us', component: AboutUsComponent, data: {title: 'COMMON.ABOUT_US', description: 'TEMPLATE.META_TAGS.ABOUT_US_DESC'}},
    {path: 'homeworks', loadChildren: () => import('./components/homeworks/homeworks.module').then(m => m.HomeworksModule)},
    {path: 'versions', component: VersionsComponent, data: {title: 'TEMPLATE.VERSIONS.TITLE', description: 'TEMPLATE.META_TAGS.VERSIONS_DESC'}},
    {path: 'how-to-use', component: HowToUseComponent, data: {title: 'TEMPLATE.HOW_TO_USE.TITLE', description: 'TEMPLATE.META_TAGS.HOW_TO_USE_DESC'}},
    {path: 'shop', component: ShopComponent, data: {title: 'TEMPLATE.SHOP.TITLE', description: 'TEMPLATE.META_TAGS.SHOP_DESC'}}
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
