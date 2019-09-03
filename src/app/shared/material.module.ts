import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule
  } from '@angular/material';

const material = [
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule
];

@NgModule({
    imports: material,
    exports: material
})
export class AppMaterialModule {

}