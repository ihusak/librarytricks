import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrdersStatuses, PaymentMethodEnum, ShopService} from '../shop.service';
import {OrderModel} from '../../../../shared/models/order.model';
import {MainService} from '../../../main.service';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {ProductModel} from '../product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {NotifyInterface} from '../../../../shared/interface/notify.interface';
import {NotificationTypes} from '../../../../shared/enums/notification-types.enum';
import {Subscription} from 'rxjs';
import {TitleService} from '../../../../shared/title.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public userInfo: any;
  public userRoles = UserRolesEnum;
  public orders: OrderModel[] = [];
  public paymentMethods = PaymentMethodEnum;
  public displayedColumns: string[] = ['position', 'userName', 'phone', 'delivery', 'address', 'city', 'additionInfo', 'products', 'sum', 'status', 'actions'];
  public orderStatuses = OrdersStatuses;
  private notifyTypes = NotificationTypes;
  private allProducts: ProductModel[] = [];
  private subscription: Subscription = new Subscription();
  constructor(
    private shopService: ShopService,
    private mainService: MainService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private titleService: TitleService
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.SHOP.ORDERS.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    const allProductsSub = this.shopService.allProducts.subscribe((products: ProductModel[]) => {
      this.allProducts = products;
    });
    this.subscription.add(allProductsSub);
    if (this.userInfo.role.id === UserRolesEnum.ADMIN) {
      const getOrdersSub = this.shopService.getOrders(OrdersStatuses.ALL).subscribe((res: OrderModel[]) => {
        this.orders = res;
      });
      this.subscription.add(getOrdersSub);
    } else {
      const getOrdersSub = this.shopService.getOrders(OrdersStatuses.PENDING).subscribe((res: OrderModel[]) => {
        this.orders = res;
      });
      this.subscription.add(getOrdersSub);
    }
  }
  public renderProductName(ids: string[]): string {
    return this.allProducts.filter((product: ProductModel) => {
      return ids.find((id: string) => id === product.id);
    }).map(((product: ProductModel) => product.title)).join(', ');
  }
  public orderSent(order: OrderModel) {
    const PRODUCTS_NAME = this.renderProductName(order.productsId);
    const updateOrderSub = this.shopService.updateOrder(order.id, OrdersStatuses.READY).subscribe(res => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.SHOP.ORDER_SENT', {id: order.id, products: PRODUCTS_NAME, userName: order.name + order.surName}), '', {
        duration: 10000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: [{
          id: order.userId
        }],
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'TEMPLATE.SHOP.TITLE',
        type: this.notifyTypes.ORDER_SENT,
        userType: [this.userRoles.STUDENT, this.userRoles.PARENT, this.userRoles.COACH],
        products: PRODUCTS_NAME
      };
      const setNotificationSub = this.mainService.setNotification(notification).subscribe((res: any) => {});
      this.subscription.add(setNotificationSub)
    });
    this.subscription.add(updateOrderSub);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
