import {ProductInterface} from './shop.service';

export class ProductModel implements ProductInterface {
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
  constructor(response: ProductInterface) {
    if (response.id) {
      this.id = response.id;
    }
    this.title = response.title;
    this.description = response.description;
    this.images = response.images;
    this.price = response.price;
    this.skillz = response.skillz;
    this.category = response.category;
    this.sizes = response.sizes;
    this.available = response.available;
    this.sale = response.sale;
    this.manufacturer = response.manufacturer;
  }
}
