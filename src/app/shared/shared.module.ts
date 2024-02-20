import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../shared/material.module';
import { LanguageComponent } from '../main/layouts/language/language.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    AppMaterialModule
  ],
  declarations: [LanguageComponent],
  exports: [
    FormsModule,
    FontAwesomeModule,
    AppMaterialModule,
    LanguageComponent
  ]
})
export class SharedModule { }
