import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserInfo {
  access_token: string,
  gmail: string,
  username: string,
  firstName: string,
  lastName: string,
  cellphone: string,
  birth: string,
  isHelper: boolean,
  password?: string,
  supervision?: string[],
  helper?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getUserByGmail(gmail: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('gmail', '==', gmail))
      .valueChanges();
  }

}
