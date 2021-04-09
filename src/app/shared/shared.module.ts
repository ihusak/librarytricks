import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../shared/material.module';
import { LanguageComponent } from '../main/layouts/language/language.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularFontAwesomeModule,
    AppMaterialModule
  ],
  declarations: [LanguageComponent],
  exports: [
    FormsModule,
    AngularFontAwesomeModule,
    AppMaterialModule,
    LanguageComponent
  ]
})
export class SharedModule { }
