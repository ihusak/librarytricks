import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { AppMaterialModule } from '../shared/material.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layouts/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserComponent } from './layouts/header/user.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { VideosComponent } from './components/videos/videos.component';
import { ProgressComponent } from './components/progress/progress.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { MainService } from './main.service';
import { IndexComponent } from './components/index/index.component';
import { MainGuardService } from './guards/main.guard';
import { AdminRequestPermissionPopupComponent } from './layouts/popups/admin-request-permission-popup/admin-request-permission-popup.component';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../shared/pipes/pipes.module';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    NotFoundComponent,
    UserComponent,
    SidenavComponent,
    VideosComponent,
    ProgressComponent,
    TasksComponent,
    RatingsComponent,
    IndexComponent,
    AdminRequestPermissionPopupComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AppMaterialModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    SharedModule,
    PipesModule
  ],
  exports: [MainComponent],
  entryComponents: [AdminRequestPermissionPopupComponent],
  providers: [MainService]
})
export class MainModule {

}
