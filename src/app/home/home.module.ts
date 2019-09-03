import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterService } from './register/register.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './login/login.service';
import { AuthGuardService } from '../main/guards/login.guard';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  exports: [
    HomeRoutingModule
  ],
  providers: [RegisterService, LoginService, AuthGuardService]
})
export class HomeModule { }
