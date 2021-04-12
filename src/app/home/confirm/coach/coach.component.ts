import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmService } from '../confirm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html'
})
export class CoachComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private confirmService: ConfirmService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    const confirmCoach = this.confirmService.confirmCoach(token).subscribe(result => {
      if (result) {
        this.router.navigate(['/main']);
      }
    });
    this.subscription.add(confirmCoach);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
