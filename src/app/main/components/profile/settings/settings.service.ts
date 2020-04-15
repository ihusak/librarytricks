import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class SettingService {
  private userId: string = localStorage.getItem('userId');
  private basePath:string = '/uploads';
  uploads;

  constructor(private afs: AngularFirestore, private fileServer: AngularFireStorage) {}
  addInfo(data) {
    console.log('add INFO', data);
    this.afs.collection('userDetails').doc(this.userId).set(data);
  }
  getUserInfo() {
    return this.afs.collection('userDetails').doc(this.userId).get();
  }
}