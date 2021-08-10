import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleService } from 'src/app/shared/title.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss']
})
export class VersionsComponent implements OnInit {
  public env: any = environment;
  private subscription: Subscription = new Subscription();
  constructor(
    private translateService: TranslateService,
    private titleService: TitleService
  ) { }


  ngOnInit() {
    const translateServiceTitleSub = this.translateService.get('TEMPLATE.VERSIONS.TITLE').subscribe((value: string) => {
      this.titleService.setTitle(value);
    });
    this.subscription.add(translateServiceTitleSub);
  }

}
