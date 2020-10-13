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
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { VideosComponent } from './components/videos/videos.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { MainService } from './main.service';
import { IndexComponent } from './components/index/index.component';
import { MainGuardService } from './guards/main.guard';
import { AdminRequestPermissionPopupComponent } from './layouts/popups/admin-request-permission-popup/admin-request-permission-popup.component';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TaskService } from './components/tasks/tasks.service';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    NotFoundComponent,
    SidenavComponent,
    VideosComponent,
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
  providers: [MainService, TaskService, CookieService]
})
export class MainModule {

}
