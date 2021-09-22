import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopListComponent} from './shop-list/shop-list.component';
import {CreateProductComponent} from './product/create-product/create-product.component';
import {ShopComponent} from './shop.component';
import {ShopCardComponent} from './shop-card/shop-card.component';
import {UpdateProductComponent} from './product/update-product/update-product.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: ShopListComponent},
      {path: 'create', component: CreateProductComponent},
      {path: 'card/:id', component: ShopCardComponent},
      {path: 'card/edit/:id', component: UpdateProductComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
