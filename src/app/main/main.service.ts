import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable()
export class MainService {
    constructor(private afs: AngularFirestore) {}
    getUserInfo() {
        return this.afs.collection('userDetails').doc(localStorage.getItem('userId')).valueChanges();
    }
}