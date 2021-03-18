import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from '../main/guards/login.guard';
import { ConfirmComponent } from './confirm/register/confirm.component';
import { CoachComponent } from './confirm/coach/coach.component';
import { MainHomeComponent } from './main-home/main-home.component';

const routes: Routes = [
    {path: '', component: HomeComponent, children: [
        {path: '', component: MainHomeComponent},
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'confirm/:token', component: ConfirmComponent},
        {path: 'userInfo/confirm/coach/:token', component: CoachComponent}
    ]},
  ];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule {

}