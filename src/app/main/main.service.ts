import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MainService {
  public user;
    constructor(private http: HttpClient) {}
    getUser(id: string) {
        return this.http.get(`api/users/${id}`);
    }
}