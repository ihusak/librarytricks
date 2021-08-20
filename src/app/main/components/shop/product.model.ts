import {ProductInterface} from './shop.service';

export class ProductModel implements ProductInterface {
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
  constructor(response: ProductInterface) {
    this.id = response.id;
    this.title = response.title;
    this.description = response.description;
    this.images = response.images;
    this.pricing = response.pricing;
    this.category = response.category;
    this.sizes = response.sizes;
    this.available = response.available;
    this.sale = response.sale;
    this.manufacturer = response.manufacturer;
  }
}
