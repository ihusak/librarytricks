import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainService } from 'src/app/main/main.service';
import { CoachInfoInterface } from 'src/app/shared/interface/user-info.interface';

@Component({
  selector: 'app-admin-request-permission-popup',
  templateUrl: './admin-request-permission-popup.component.html',
  styleUrls: ['./admin-request-permission-popup.component.scss']
})
export class AdminRequestPermissionPopupComponent implements OnInit {
  public phone: string;

  constructor(
    public dialogRef: MatDialogRef<AdminRequestPermissionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public user: CoachInfoInterface,
    private mainService: MainService,
    private snackBar: MatSnackBar) {
      this.phone = this.user.phone;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  request() {
    this.dialogRef.close();
    this.mainService.requestCoachPermission(this.user.id, this.phone).subscribe((res) => {
      this.snackBar.open('Запрос успешно отправлен', '', {
        duration: 2000,
        panelClass: ['success']
      });
    })
  }

  ngOnInit() {
  }

}
