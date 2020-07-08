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

@NgModule({
  declarations: [ProfileComponent, OverviewComponent, SettingsComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatCardModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ProfileService]
})
export class ProfileModule {

}
