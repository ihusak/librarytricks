import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmService } from '../confirm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private confirmService: ConfirmService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    const confirmRegister = this.confirmService.confirmRegister(token).subscribe(result => {
      if (result) {
        this.router.navigate(['/login']);
      }
    });
    this.subscription.add(confirmRegister);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
