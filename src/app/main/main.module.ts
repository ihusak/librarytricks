import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layouts/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { VideosComponent } from './components/videos/videos.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { MainService } from './main.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminRequestPermissionPopupComponent } from './layouts/popups/admin-request-permission-popup/admin-request-permission-popup.component';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TaskService } from './components/tasks/tasks.service';
import {CookieService} from 'ngx-cookie-service';
import {TranslateModule} from '@ngx-translate/core';
import { PaymentsComponent } from './components/payments/payments.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { VersionsComponent } from './components/versions/versions.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';
import { ErrorPageComponent } from './layouts/error-page/error-page.component';
import {VideosService} from './components/videos/videos.service';
import {CreateVideoComponent} from './components/videos/create-video/create-video.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from 'ngx-mask';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    NotFoundComponent,
    SidenavComponent,
    VideosComponent,
    RatingsComponent,
    DashboardComponent,
    AdminRequestPermissionPopupComponent,
    PaymentsComponent,
    AboutUsComponent,
    VersionsComponent,
    HowToUseComponent,
    ErrorPageComponent,
    CreateVideoComponent
  ],
  imports: [
    SharedModule,
    MainRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  exports: [MainComponent],
  providers: [
    MainService,
    TaskService,
    CookieService,
    VideosService,
    provideNgxMask()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {

}
