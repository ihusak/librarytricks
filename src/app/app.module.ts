import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainModule } from './main/main.module';
import { HomeModule } from './home/home.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
  AppComponent
  ],
  imports: [
  BrowserModule,
  MatProgressSpinnerModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireAuthModule,
  AngularFireStorageModule,
  AngularFirestoreModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  SharedModule,
  HomeModule,
  MainModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
