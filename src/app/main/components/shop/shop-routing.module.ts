import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopListComponent} from './shop-list/shop-list.component';
import {CreateProductComponent} from './product/create-product/create-product.component';
import {ShopComponent} from './shop.component';
import {UpdateProductComponent} from './product/update-product/update-product.component';
import {ProductComponent} from './product/product.component';
import {CheckoutComponent} from './checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: ShopListComponent},
      {path: 'create', component: CreateProductComponent},
      {path: 'product/:id', component: ProductComponent},
      {path: 'product/edit/:id', component: UpdateProductComponent},
      {path: 'checkout', component: CheckoutComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
