import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from 'src/app/main/main.service';
import { UserInfoInterface } from 'src/app/shared/interface/user-info.interface';

@Component({
  selector: 'app-admin-request-permission-popup',
  templateUrl: './admin-request-permission-popup.component.html',
  styleUrls: ['./admin-request-permission-popup.component.scss']
})
export class AdminRequestPermissionPopupComponent implements OnInit {
  public phone: string;

  constructor(
    public dialogRef: MatDialogRef<AdminRequestPermissionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserInfoInterface,
    private mainService: MainService) {
      this.phone = this.user.phone;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  request() {
    console.log('request', this.user);
    this.dialogRef.close();
    this.mainService.requestCoachPermission(this.user.id, this.phone).subscribe((res) => {
      console.log(res);
    })
  }

  ngOnInit() {
  }

}
