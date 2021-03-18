import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateLocalService {

  constructor(private translateService: TranslateService) {
    
  }

  public setLang(lang: string) {
    this.translateService.use(lang);
  }
}