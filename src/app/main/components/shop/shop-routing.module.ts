import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopListComponent} from './shop-list/shop-list.component';
import {CreateProductComponent} from './product/create-product/create-product.component';
import {ShopComponent} from './shop.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: ShopListComponent},
      {path: 'create', component: CreateProductComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
