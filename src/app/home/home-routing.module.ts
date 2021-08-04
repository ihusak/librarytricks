import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/register/confirm.component';
import { CoachComponent } from './confirm/coach/coach.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from './forgot-password/recover-password/recover-password.component';

const routes: Routes = [
    {path: '', component: HomeComponent, children: [
        {path: '', component: MainHomeComponent},
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'register/:token/:roleId', component: RegisterComponent},
        {path: 'forgot-password', component: ForgotPasswordComponent},
        {path: 'recovery', component: RecoverPasswordComponent},
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
