import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import {HttpClient} from '@angular/common/http';

export interface Payment {
  version: number;
  env: boolean;
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
}

export interface Checkout {
  course: {
    id: string;
    name: string;
    description: string;
  };
  paid: boolean;
  price: number;
  user: {
    id: string;
    name: string;
    roleName: string;
  }
}


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  constructor(
    public http: HttpClient,
    public appService: AppService
  ) {}
    public getPaidCourses(userId: string) {
      return this.http.get(`${this.appService.apiUrl()}/payments/user/${userId}/payments`).pipe(map((data: any) => {
        return data;
      }));
    }

    public preparePayment(payment: Payment) {
        return this.http.post(`${this.appService.apiUrl()}/payments/create`, {payment}).pipe(map((data: any) => {
          return data;
        }));
    }

    public checkout(checkout: Checkout) {
      return this.http.post(`${this.appService.apiUrl()}/payments/checkout`, {checkout}).pipe(map((data: any) => {
        return data;
      }));
    }
}
