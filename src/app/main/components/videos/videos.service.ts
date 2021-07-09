import { Injectable } from '@angular/core';
import {AppService} from '../../../app.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface VideoInterface {
  id: string;
  description: string;
  likes: string[];
  createdBy: {
    id: string;
    name: string;
  };
  createdDate: string;
  verified: boolean;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideosService extends AppService  {
  public getAllVideos(): Observable<VideoInterface[]> {
    return this.http.get(`${this.apiUrl()}/videos/list`).pipe(map((videos: any) => {
      return videos;
    }));
  }
  public createPost(value: any) {
    return this.http.post(`${this.apiUrl()}/videos/create`, value);
  }
}
