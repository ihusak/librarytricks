import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
    // {path: 'start-page', component: StartPageComponent},
    {path: '', loadChildren: './home/home.module#HomeModule'},
  //   {path: '', component: HomeComponent, children: [
  //     {path: 'login', component: LoginComponent},
  //     {path: 'register', component: RegisterComponent}
  // ]},
    {path: 'main', loadChildren: './main/main.module#MainModule'},
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