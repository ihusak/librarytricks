import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleService } from 'src/app/shared/title.service';
import { CATEGORIES, ShopService } from '../../shop.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  public productForm: FormGroup;
  private subscription: Subscription = new Subscription();
  public categoryList: object[] = CATEGORIES; 
  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.TASK_LIST.COACH.CREATE_TASK.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      images: [[], [Validators.required]],
      price: [0, Validators.required],
      skillz: [0 , Validators.required],
      category: ['', Validators.required],
      sizes: [[], Validators.required],
      available: [true],
      sale: [0],
      manufacturer: ['Ukraine', Validators.required]
    });
    // this.initForm = true;
  }
  public createProduct() {
    console.log(this.productForm.value);
  }
}
