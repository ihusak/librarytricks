import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MainGuardService } from './main/guards/main.guard';
import { ErrorPageComponent } from './main/layouts/error-page/error-page.component';

const routes: Routes = [
    {path: '', loadChildren: './home/home.module#HomeModule'},
    {path: 'main', loadChildren: './main/main.module#MainModule', canActivate: [MainGuardService]},
    {path: 'error', component: ErrorPageComponent},
    {path: '**', redirectTo: ''}
  ];

@NgModule({
    imports: [
      RouterModule.forRoot(routes, {
          preloadingStrategy: PreloadAllModules
      })
  ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {

}