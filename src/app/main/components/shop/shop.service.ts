import { Observable } from "rxjs/internal/Observable";
import { AppService } from "src/app/app.service";

export class ShopService extends AppService {
  public createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl()}/shop/create`, product);
  }
  public getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl()}/shop/products`);
  }
  public updateProduct(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl()}/shop/products/${product.id}`, {product});
  }
  public deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl()}/shop/products/${id}`);
  }
}