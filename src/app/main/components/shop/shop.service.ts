import { Observable } from 'rxjs/internal/Observable';
import { AppService } from 'src/app/app.service';
import {ProductModel} from './product.model';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {OrderInterface, OrderModel} from '../../../shared/models/order.model';

export const CATEGORIES = [
 {title: 'BALL', sizes: null},
 {title: 'CLOTHES', sizes: ['XS', 'S', 'M', 'L', 'XL']},
 {title: 'FOOTWEAR', sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44']},
 {title: 'ACCESSORIES', sizes: null}
];

export interface ProductInterface {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  skillz: number;
  category: string;
  sizes: object[];
  available: boolean;
  sale: number;
  manufacturer: string;
}

export enum OrdersStatuses {
  PENDING = 'pending',
  READY = 'ready',
  ALL = 'all'
}

export enum PaymentMethodEnum {
  SKILLZ = 'skillz',
  PRICE = 'price'
}

@Injectable()
export class ShopService extends AppService {
  public allProducts: BehaviorSubject<ProductModel[]> = new BehaviorSubject<ProductModel[]>([]);
  public products: ProductModel[] = [];

  public checkout(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl()}/shop/order/checkout`, {order}).pipe(map(res => {
      return res;
    }));
  }

  public createProduct(formData): Observable<ProductModel> {
    return this.http.post(`${this.apiUrl()}/shop/create`, formData).pipe(map((responseProduct: ProductInterface) => {
      return new ProductModel(responseProduct);
    }));
  }
  public getAllProducts(): Observable<ProductModel[]> {
    return this.http.get(`${this.apiUrl()}/shop/products`).pipe(map((response: ProductInterface[]) => {
      return response.map((p: ProductInterface) => new ProductModel(p));
    }));
  }
  public getOrders(status: OrdersStatuses): Observable<OrderModel[]> {
    return this.http.get(`${this.apiUrl()}/shop/order/${status}`).pipe(map((response: OrderInterface[]) => {
      return response.map((order: OrderInterface) => new OrderModel(order));
    }));
  }
  public updateProduct(id: string, formData): Observable<ProductModel> {
    return this.http.put(`${this.apiUrl()}/shop/product/${id}/update`, formData).pipe(map((responseProduct: ProductInterface) => {
      console.log(responseProduct);
      return new ProductModel(responseProduct);
    }));
  }
  public updateOrder(orderId: string, status: OrdersStatuses): Observable<OrderInterface> {
    return this.http.put(`${this.apiUrl()}/shop/order/update/${orderId}`, {status}).pipe(map((response: OrderInterface) => {
      return response;
    }));
  }
  public deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl()}/shop/product/${id}/delete`);
  }
  public getProductById(id: string): Observable<ProductModel> {
    return this.http.get(`${this.apiUrl()}/shop/product/${id}`).pipe(map((response: ProductInterface) => {
      return new ProductModel(response);
    }));
  }
}
