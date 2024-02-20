import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';

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
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatCardModule,
    MatMenuModule,
    MatPaginatorModule
];

@NgModule({
    imports: material,
    exports: material,
    providers: [{
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
  }]
})
export class AppMaterialModule {

}
