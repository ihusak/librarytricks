import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileLoyoutComponent } from './profile-loyout/profile-loyout.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileLoyoutComponent,
        children: [
            {path: '', redirectTo: 'overview', pathMatch: 'full'},
            {path: 'overview', component: OverviewComponent},
            {path: 'settings', component: SettingsComponent},
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {

}