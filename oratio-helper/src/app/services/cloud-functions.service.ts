import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { UserInfo } from './user.service';

const FIREBASE_API_URL = 'https://us-central1-projet-s9-oratio.cloudfunctions.net/API';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionsService {

  constructor(private http: HttpClient) { }

  public checkHelper(gmail: string): Observable<any> {
    return this.http.post(FIREBASE_API_URL + '/checkHelper', { gmail: gmail });
  }

  public addUser(user: UserInfo): Observable<any> {
    return this.http.post(FIREBASE_API_URL + '/addUser', user);
  }

}
