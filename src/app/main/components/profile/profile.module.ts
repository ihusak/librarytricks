import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileLoyoutComponent } from './profile-loyout/profile-loyout.component';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { MatCardModule } from '@angular/material';
import { AppMaterialModule } from 'src/app/shared/material.module';

@NgModule({
    declarations: [ProfileLoyoutComponent, OverviewComponent, SettingsComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MatCardModule,
        AppMaterialModule
    ]
})
export class ProfileModule {

}