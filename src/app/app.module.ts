import {BrowserModule, Meta} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MainModule } from './main/main.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { MainGuardService } from './main/guards/main.guard';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { AuthInterceptor } from './main/interceptors/auth.interceptor';
import { LoaderInterceptorService } from './shared/loader/loader.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { PipesModule } from './shared/pipes/pipes.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppService } from './app.service';
import { ErrorHandlerInterceptor } from './main/interceptors/error.handler.intercaptor';
import { PaginationTranslate } from './shared/translate/pagination-translate';
import {MatPaginatorIntl} from '@angular/material/paginator';

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
  HttpClientModule,
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  SharedModule,
  HomeModule,
  MainModule,
  PipesModule,
  TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
    }
  }),
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
    useClass: ErrorHandlerInterceptor,
    multi: true
  },
  {
    provide: MatPaginatorIntl,
    deps: [TranslateService],
    useFactory: (translateService: TranslateService) => new PaginationTranslate(translateService).getPaginatorIntl()
  },
    Meta
],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
