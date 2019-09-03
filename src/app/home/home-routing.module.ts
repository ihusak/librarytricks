import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from '../main/guards/login.guard';

const routes: Routes = [
    {path: '', component: HomeComponent, children: [
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent}
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