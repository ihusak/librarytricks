import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent, data: {title: 'COMMON.MAIN', description: 'TEMPLATE.META_TAGS.PROFILE_DESC'}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {

}
