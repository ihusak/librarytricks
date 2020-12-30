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
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './main/interceptors/auth.interceptor';
import { LoaderInterceptorService } from './shared/loader/loader.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { PipesModule } from './shared/pipes/pipes.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'api/translate/', '.json');
}


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
  MainModule,
  PipesModule,
  TranslateModule.forRoot({
    defaultLanguage: 'ru',
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
})
  ],
  providers: [
    MainGuardService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
