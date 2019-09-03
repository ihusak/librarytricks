import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
    userData: Observable<firebase.User>;
    constructor(private angularFireAuth: AngularFireAuth) {
        this.userData = angularFireAuth.authState;
    }
    signUp(email: string, pass: string) {
        this.angularFireAuth
        .auth
        .createUserWithEmailAndPassword(email, pass)
        .then(res => {
            console.log('Successfully signed up!', res);
          })
          .catch(error => {
            console.log('Something is wrong:', error.message);
          });
    }
    signOut() {
        this.angularFireAuth
          .auth
          .signOut();
      }
}