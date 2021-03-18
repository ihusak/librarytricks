import { Component, OnInit } from '@angular/core';
import { ConfirmService } from '../confirm.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html'
})
export class CoachComponent implements OnInit {

  constructor(private confirmService: ConfirmService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    console.log(token);
    this.confirmService.confirmCoach(token).subscribe(result => {
      if (result) {
        this.router.navigate(['/main']);
      }
    });
  }

}
