import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { AppMaterialModule } from '../shared/material.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layouts/header/header.component';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserComponent } from './layouts/header/user.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { UserPanelComponent } from './layouts/sidenav/user-panel/user-panel.component';
import { VideosComponent } from './components/videos/videos.component';
import { ProgressComponent } from './components/progress/progress.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { MainService } from './main.service';
import { IndexComponent } from './components/index/index.component';

@NgModule({
    declarations: [
        MainComponent,
        HeaderComponent,
        NotFoundComponent,
        UserComponent,
        SidenavComponent,
        UserPanelComponent,
        VideosComponent,
        ProgressComponent,
        TasksComponent,
        RatingsComponent,
        IndexComponent
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        AppMaterialModule,
        MatSidenavModule,
        MatIconModule,
        MatMenuModule
    ],
    exports: [MainComponent],
    providers: [MainService]
})
export class MainModule {

}