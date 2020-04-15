import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MainGuardService } from './main/guards/main.guard';

const routes: Routes = [
    {path: '', loadChildren: './home/home.module#HomeModule'},
    {path: 'main', loadChildren: './main/main.module#MainModule', canActivate: [MainGuardService]},
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