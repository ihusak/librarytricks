import { Observable } from 'rxjs/internal/Observable';
import { AppService } from 'src/app/app.service';
import {ProductModel} from './product.model';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

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
  pricing: {
    price: number,
    skillz: number
  };
  category: string;
  sizes: object[];
  available: boolean;
  sale: number;
  manufacturer: string;
}
@Injectable()
export class ShopService extends AppService {
  public createProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.post(`${this.apiUrl()}/shop/create`, product).pipe(map((responseProduct: ProductInterface) => {
      return new ProductModel(responseProduct);
    }));
  }
  public getAllProducts(): Observable<ProductModel[]> {
    return this.http.get(`${this.apiUrl()}/shop/products`).pipe(map((response: ProductInterface[]) => {
      return response.map((p: ProductInterface) => new ProductModel(p));
    }));
  }
  public updateProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.put(`${this.apiUrl()}/shop/products/${product.id}`, {product}).pipe(map((responseProduct: ProductInterface) => {
      return new ProductModel(responseProduct);
    }));
  }
  public deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl()}/shop/products/${id}`);
  }
}
