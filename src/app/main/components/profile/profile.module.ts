import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { MatCardModule } from '@angular/material/card';
import { AppMaterialModule } from 'src/app/shared/material.module';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProfileComponent, OverviewComponent, SettingsComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatCardModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule
  ],
  providers: [ProfileService]
})
export class ProfileModule {

}
