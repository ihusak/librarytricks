import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MainGuardService } from './main/guards/main.guard';
import { ErrorPageComponent } from './main/layouts/error-page/error-page.component';

const routes: Routes = [
    {path: '', loadChildren: () => import('src/app/home/home.module').then(m => m.HomeModule)},
    {path: 'main', loadChildren: () => import('src/app/main/main.module').then(m => m.MainModule), canActivate: [MainGuardService]},
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
