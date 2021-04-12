import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/main/main.service';
import { CoachInfoInterface } from 'src/app/shared/interface/user-info.interface';

@Component({
  selector: 'app-admin-request-permission-popup',
  templateUrl: './admin-request-permission-popup.component.html',
  styleUrls: ['./admin-request-permission-popup.component.scss']
})
export class AdminRequestPermissionPopupComponent implements OnDestroy {
  public phone: string;
  private subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<AdminRequestPermissionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public user: CoachInfoInterface,
    private mainService: MainService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar) {
      this.phone = this.user.phone;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  request() {
    this.dialogRef.close();
    const requestCoachPermission = this.mainService.requestCoachPermission(this.user.id, this.phone).subscribe((res) => {
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.REQUEST_SENT'), '', {
        duration: 2000,
        panelClass: ['success']
      });
    });
    this.subscription.add(requestCoachPermission);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
