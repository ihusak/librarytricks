import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule
  } from '@angular/material';

const material = [
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule 
];

@NgModule({
    imports: material,
    exports: material
})
export class AppMaterialModule {

}