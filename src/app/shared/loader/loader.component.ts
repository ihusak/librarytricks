import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader.interface';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
/**
 * Loader component than reflect on requset methods
 */
export class LoaderComponent implements OnInit, OnDestroy {
  public show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    // loader subscription
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
    });
  }
  // unsubscribe load subscription
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
