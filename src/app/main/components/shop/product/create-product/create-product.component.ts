import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleService } from 'src/app/shared/title.service';
import { ProductModel } from '../../product.model';
import {CATEGORIES, ProductInterface, ShopService} from '../../shop.service';
import {NotifyInterface} from '../../../../../shared/interface/notify.interface';
import {MainService} from '../../../../main.service';
import {NotificationTypes} from '../../../../../shared/enums/notification-types.enum';
import {UserRolesEnum} from '../../../../../shared/enums/user-roles.enum';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  public productForm: FormGroup;
  private subscription: Subscription = new Subscription();
  public categoryList: object[] = CATEGORIES;
  private userInfo: any;
  private notifyTypes = NotificationTypes;
  public userRoles = UserRolesEnum;

  private fileData: File[] = null;
  public images: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private titleService: TitleService,
    private mainService: MainService
  ) {
    this.userInfo = mainService.userInfo;
  }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.SHOP.PRODUCT.CREATE_PRODUCT').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      images: [[], [Validators.required]],
      price: [0],
      skillz: [0 , Validators.required],
      category: ['', Validators.required],
      // sizes: [[], Validators.required],
      available: [true],
      sale: [0, Validators.max(100)],
      manufacturer: ['Ukraine', Validators.required]
    });
  }
  public createProduct() {
    const PRODUCT = new ProductModel(this.productForm.value);
    const formData = new FormData();
    formData.append('product', JSON.stringify(PRODUCT));
    if (this.fileData && this.fileData.length) {
      [...this.fileData].forEach((file: File) => {
        formData.append('productsImg', file);
      });
    }
    const createProductSub = this.shopService.createProduct(formData).subscribe((product: ProductInterface) => {
      const PRODUCT = new ProductModel(product);
      const UPDATED_LIST_PRODUCT = this.shopService.products.map((p: ProductModel) => {
        if (p.id === PRODUCT.id) {
          return PRODUCT;
        } else {
          return p;
        }
      });
      this.shopService.allProducts.next(UPDATED_LIST_PRODUCT);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.SHOP.PRODUCT_CREATED'), '', {
        duration: 4000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      const notification: NotifyInterface = {
        users: null,
        author: {
          id: this.userInfo.id,
          name: this.userInfo.userName
        },
        title: 'TEMPLATE.SHOP.TITLE',
        type: this.notifyTypes.NEW_PRODUCT,
        userType: [this.userRoles.STUDENT, this.userRoles.PARENT, this.userRoles.COACH],
        products: PRODUCT.title
      };
      this.mainService.setNotification(notification).subscribe((res: any) => {});
      this.goToList();
    });
    this.subscription.add(createProductSub);
  }
  public fileProgress(fileInput: any) {
    const FILE = <File[]>fileInput.target.files;
    this.fileData = <File[]>fileInput.target.files;
    this.preview(FILE);
  }
  public goToList() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  private preview(file: File[]) {
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.WRONG_FILE_FORMAT'), '', {
        duration: 4000,
        panelClass: ['error'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }
    if(file && file[0]) {
      let filesAmount = file.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (_event: any) => {
          this.images.push(_event.target.result);
          this.productForm.controls['images'].patchValue(this.images.length);
          this.productForm.controls['images'].markAsDirty();
        };
        reader.readAsDataURL(file[i]);
      }
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
