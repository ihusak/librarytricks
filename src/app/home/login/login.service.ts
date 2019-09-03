import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Subject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLogin } from '../interface/user.login.interface';

@Injectable()
export class LoginService {
    constructor(
        private http: HttpClient,
        private authUser: AngularFireAuth) {}

    loginUser(email: string, pass: string) {
        return from(this.authUser.auth.signInWithEmailAndPassword(email, pass)).pipe(map(data => {
            console.log('piped data', data);
            return {
                email: data.user.email,
                id: data.user.uid
            };
        }));
    }
}