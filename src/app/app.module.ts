import {BrowserModule, Meta} from '@angular/platform-browser';
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
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppService } from './app.service';
import { ErrorHandlerIntercaptor } from './main/interceptors/error.handler.intercaptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginationTranslate } from './shared/translate/pagination-translate';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${environment.api_url}/translate/`, '.json');
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
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
  })
  ],
  providers: [
    MainGuardService,
    AppService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerIntercaptor,
    multi: true
  },
  {
    provide: MatPaginatorIntl, deps: [TranslateService],
    useFactory: (translateService: TranslateService) => new PaginationTranslate(translateService).getPaginatorIntl()
  },
    Meta
],
  bootstrap: [AppComponent]
})
export class AppModule { }
