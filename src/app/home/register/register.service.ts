import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable()
export class RegisterService {
    isLoggedIn: boolean;

    constructor(
        private http: HttpClient,
        private authUser: AngularFireAuth) {}

    registerUser(email: string, pass: string) {
        console.log(email, pass);
        return from(this.authUser.auth.createUserWithEmailAndPassword(email, pass));
    }
}