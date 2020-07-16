import { Component, OnInit } from '@angular/core';
import { ConfirmService } from './confirm.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(private confirmService: ConfirmService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    console.log(token);
    this.confirmService.confirmRegister(token).subscribe(result => {
      if (result) {
        this.router.navigate(['/login']);
      }
    });
  }

}
