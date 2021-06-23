import { Injectable } from '@angular/core';
import {AppService} from '../../../app.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideosService extends AppService  {
  public getAllVideos() {
    return this.http.get(`${this.apiUrl()}/videos/list`).pipe(map((videos: any) => {
      return videos;
    }));
  }
  public createPost(value: any) {
    return this.http.post(`${this.apiUrl()}/videos/create`, {
      url: value.url,
      author: {
        id: value.author.id,
        name: value.author.name
      }
    });
  }
}
