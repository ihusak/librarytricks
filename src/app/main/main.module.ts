import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './main.component';
import { ProfileComponent } from './profile/profile.component';
import { AppMaterialModule } from '../shared/material.module';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
    declarations: [
        MainComponent,
        NavComponent,
        ProfileComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        AppMaterialModule
    ],
    exports: [MainComponent]
})
export class MainModule {

}