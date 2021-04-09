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
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/register/confirm.component';
import { ConfirmService } from './confirm/confirm.service';
import { LoginServiceModule } from './login/login.service.module';
import { CoachComponent } from './confirm/coach/coach.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageComponent } from '../main/layouts/language/language.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    CoachComponent,
    MainHomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    LoginServiceModule,
    TranslateModule
  ],
  exports: [
    HomeRoutingModule
  ],
  providers: [RegisterService, LoginService, AuthGuardService, ConfirmService]
})
export class HomeModule { }
