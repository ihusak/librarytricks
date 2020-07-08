import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainModule } from './main/main.module';
import { HomeModule } from './home/home.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './shared/shared.module';
import { MainGuardService } from './main/guards/main.guard';
import { AppService } from './app.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './main/interceptors/auth.interceptor';
import { AuthService } from './auth.service';
import { LoaderInterceptorService } from './shared/loader/loader.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';

@NgModule({
  declarations: [
  AppComponent,
  LoaderComponent
  ],
  imports: [
  BrowserModule,
  MatProgressSpinnerModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  SharedModule,
  HomeModule,
  MainModule
  ],
  providers: [MainGuardService, AppService, AuthService,
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
