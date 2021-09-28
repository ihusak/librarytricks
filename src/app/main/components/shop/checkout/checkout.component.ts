import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductModel} from '../product.model';
import {ShopService} from '../shop.service';
import {BasketService} from '../basket/basket.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TitleService} from '../../../../shared/title.service';
import {Subscription} from 'rxjs';
import {MainService} from '../../../main.service';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import { MatRadioChange, MatSnackBar } from '@angular/material';

enum PaymentMethodEnum {
  SKILLZ = 'skillz',
  PRICE = 'price'
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public productListToCheckout: ProductModel[] = [];
  public receiverForm: FormGroup;
  public deliveryTypes: string[] = ['post', 'take_away'];
  public paymentMethod: string = '';
  public notEnoughMoney: boolean = false;
  public userInfo: any;
  public userRoles = UserRolesEnum;
  public paymentMethodType = PaymentMethodEnum;
  private subscription: Subscription = new Subscription();
  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private titleService: TitleService,
    private mainService: MainService
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.SHOP.CHECKOUT.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    const selectedProducts = localStorage.getItem('addedProducts').split(',');
    this.shopService.allProducts.subscribe((products: ProductModel[]) => {
      this.productListToCheckout = products.filter((product: ProductModel) => selectedProducts.find(id => id === product.id));
      this.receiverForm = this.formBuilder.group({
        name: [this.userInfo.userName.split(' ')[0], [Validators.required]],
        surName: [this.userInfo.userName.split(' ')[1], [Validators.required]],
        phone: [this.userInfo.phone, Validators.required],
        city: ['', [Validators.required]],
        delivery: ['', Validators.required],
        address: ['', Validators.required],
        additionInfo: ['', [Validators.required]],
        paymentMethod: ['', [Validators.required]],
        productsId: [this.productListToCheckout.map(p => p.id), [Validators.required]],
        sum: ['', [Validators.required]]
      });
    });
  }
  public checkout() {
    const CHECKOUT_INFO = this.receiverForm.value;
    console.log(CHECKOUT_INFO);
    this.shopService.checkout(CHECKOUT_INFO).subscribe(() => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.SHOP.ORDERED_SUCCESSFULL'), '', {
        duration: 4000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      localStorage.removeItem('addedProducts');
      this.basketService.basketObj.next([]);
    })
  }
  public changeDelivery(value: string) {
    const ctrl = this.receiverForm.get('address');
    if (value === 'post') {
      ctrl.enable();
    } else {
      ctrl.disable();
    }
  }
  public calculateCheckout(method: MatRadioChange) {
    let summary = this.productListToCheckout.map(p => parseFloat(p[method.value])).reduce((item: number, result: number) => result += item, 0);
    if (method.value === this.paymentMethodType.PRICE) {
      this.notEnoughMoney = false;
    } else {
      this.notEnoughMoney = this.userInfo.rating - summary < 0;
    }
    this.receiverForm.get('sum').setValue(summary);
  }
  public sum(products: ProductModel[], type: string): number {
    return this.basketService.priceSum(products, type);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}