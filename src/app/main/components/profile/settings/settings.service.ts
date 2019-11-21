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
  // pushUpload(upload) {
  //   let storageRef = this.fileServer.storage.ref();
  //   let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

  //   uploadTask.on(this.fileServer.storage.TaskEvent.STATE_CHANGED,
  //     (snapshot) =>  {
  //       // upload in progress
  //       upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //     },
  //     (error) => {
  //       // upload failed
  //       console.log(error)
  //     },
  //     () => {
  //       // upload success
  //       upload.url = uploadTask.snapshot.downloadURL
  //       upload.name = upload.file.name
  //       this.saveFileData(upload)
  //     }
  //   );
  // }



  // // Writes the file details to the realtime db
  // private saveFileData(upload:) {
  //   this.afs.collection(`${this.basePath}/`).push(upload);
  // }
}