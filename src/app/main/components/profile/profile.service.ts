import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ProfileService {
    constructor(private afs: AngularFirestore) {}
    addInfo(data) {
        console.log('add INFO', data);
        this.afs.collection('userDetails').doc(localStorage.getItem('userId')).set({name: data, userName: 'surname' + data});
    }
}