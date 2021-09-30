import {OrdersStatuses} from '../../main/components/shop/shop.service';

export interface OrderInterface {
  id: string;
  name: string;
  surName: string;
  phone: string;
  city: string;
  delivery: string;
  address: string;
  additionInfo: string;
  paymentMethod: string;
  productsId: string[];
  sum: number;
  userId: string;
  status: OrdersStatuses;
}

export class OrderModel {
  id: string;
  name: string;
  surName: string;
  phone: string;
  city: string;
  delivery: string;
  address: string;
  additionInfo: string;
  paymentMethod: string;
  productsId: string[];
  sum: number;
  userId: string;
  status: OrdersStatuses;
  constructor(response: OrderInterface) {
    this.id = response.id;
    this.name = response.name;
    this.surName = response.surName;
    this.phone = response.phone;
    this.city = response.city;
    this.delivery = response.delivery;
    this.address = response.address;
    this.additionInfo = response.additionInfo;
    this.paymentMethod = response.paymentMethod;
    this.productsId = response.productsId;
    this.sum = response.sum;
    this.userId = response.userId;
    this.status = response.status;
  }
}
