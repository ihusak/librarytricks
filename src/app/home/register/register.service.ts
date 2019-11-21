import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class RegisterService {
  isLoggedIn: boolean;

  constructor(
    private afs: AngularFirestore,
    private authUser: AngularFireAuth) {}

  registerUser(email: string, pass: string) {
    console.log(email, pass);
    return from(this.authUser.auth.createUserWithEmailAndPassword(email, pass));
  }
  addInfo(email: string, userId: string, name: string, userStatus: string) {
    const userDetailsObj = {
      userEmail: email,
      userName: name,
      permission: userStatus
    };
    console.log('userId register with name', userId);
    this.afs.collection('userDetails').doc(userId).set(userDetailsObj);
  }
}