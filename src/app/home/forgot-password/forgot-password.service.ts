import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

export interface RecoveryPasswordInterface {
  email: string;
  newPassword: string;
};

@Injectable()
export class ForgotPasswordService extends AppService {

  public recoveryPassword(recoveryPasswordData: RecoveryPasswordInterface): Observable<any> {
    return this.http.post(`${this.apiUrl()}/users/recovery`, {
      email: recoveryPasswordData.email,
      newPassword: recoveryPasswordData.newPassword
    });
  }
}
