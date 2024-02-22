import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from '../main/layouts/language/language.component';
import {AppMaterialModule} from './material.module';
import {PipesModule} from './pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    PipesModule
  ],
  declarations: [LanguageComponent],
  exports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    PipesModule,
    LanguageComponent
  ]
})
export class SharedModule { }
