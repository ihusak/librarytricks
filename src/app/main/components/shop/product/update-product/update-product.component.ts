import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {CATEGORIES, ProductInterface, ShopService} from '../../shop.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {TitleService} from '../../../../../shared/title.service';
import {ProductModel} from '../../product.model';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit, OnDestroy {
  public productForm: FormGroup;
  private subscriptions: Subscription = new Subscription();
  public categoryList: object[] = CATEGORIES;
  public product: ProductInterface;

  private fileData: File[] = null;
  public images: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    const ID = this.route.snapshot.paramMap.get('id');
    this.shopService.getProductById(ID).subscribe((product: ProductInterface) => {
      this.product = product;
      this.images = product.images;
      this.productForm = this.formBuilder.group({
        title: [product.title, [Validators.required]],
        description: [product.description, [Validators.required]],
        images: [product.images, [Validators.required]],
        price: [product.price],
        skillz: [product.skillz, Validators.required],
        category: [product.category, Validators.required],
        // sizes: [[], Validators.required],
        available: [product.available],
        sale: [product.sale, Validators.max(100)],
        manufacturer: [product.manufacturer, Validators.required]
      });
      this.titleService.setTitle(product.title);
    });
  }
  public fileProgress(fileInput: any) {
    const FILE = <File[]>fileInput.target.files;
    this.fileData = <File[]>fileInput.target.files;
    this.preview(FILE);
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
          this.productForm.controls['images'].patchValue(this.images);
          this.productForm.controls['images'].markAsDirty();
        };
        reader.readAsDataURL(file[i]);
      }
    }
  }
  public updateProduct() {
    this.productForm.value.images = this.productForm.value.images.filter(img => img.indexOf('base64') < 0);
    const PRODUCT = new ProductModel(this.productForm.value);
    const formData = new FormData();
    const ID = this.route.snapshot.paramMap.get('id');
    formData.append('product', JSON.stringify(PRODUCT));
    if (this.fileData && this.fileData.length) {
      [...this.fileData].forEach((file: File) => {
        formData.append('productsImg', file);
      });
    }
    const updateProductSub = this.shopService.updateProduct(ID, formData).subscribe(res => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.SHOP.PRODUCT_UPDATED'), '', {
        duration: 4000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    });
    this.subscriptions.add(updateProductSub);
    // this.goBack();
  }
  public removeImage(src: string) {
    this.images = this.images.filter((itemSrc: string) => itemSrc !== src);
    this.productForm.controls['images'].patchValue(this.images);
    this.productForm.controls['images'].markAsDirty();
  }
  compareCategories(o1: any, o2: any): boolean {
    return o1.title === o2.title;
  }
  public goBack() {
    this.router.navigate(['../../../'], {relativeTo: this.route});
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
