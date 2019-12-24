import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Supervision {
  new: boolean,
  username: string
}

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
  supervision?: Supervision[],
  helper?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getHelpers(): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('isHelper', '==', true))
      .valueChanges();
  }

  getUserByGmail(gmail: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('gmail', '==', gmail))
      .valueChanges();
  }

  getUserByUsername(username: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('username', '==', username))
      .valueChanges();
  }

  getAge(user: UserInfo): number {
    const reg = new RegExp('^([\\d]{2})/([\\d]{2})/([\\d]{4})$', 'i');
    const result = user.birth.match(reg);
    if (result === null || result === undefined) { throw new Error('UserService.getAge : Bad user birth string.') }
    const userDay: number = Number(result[1]);
    const userMonth: number = Number(result[2]);
    const userYear: number = Number(result[3]);
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    let age: number = todayYear - userYear;
    if (todayMonth < userMonth) { age--; }
    else if (todayMonth === userMonth && todayDay < userDay) { age--; }
    return age;
  }

  sortUsersByName(users: UserInfo[]): UserInfo[] {
    if (users.length === 0) { return []; }
    let sortedUsers: UserInfo[] = [];
    for (let user of users) {
      if (sortedUsers.length === 0) { sortedUsers.push(user); }
      else {
        let index: number = 0;
        while (index < sortedUsers.length && this.compareUserNames(user, sortedUsers[index])) { index++; }
        if (index === sortedUsers.length) { sortedUsers.push(user); }
        else { sortedUsers.splice(index, 0, user); }
      }
    }
    return sortedUsers;
  }

  compareUserNames(user1: UserInfo, user2: UserInfo): boolean {
    if (user1.firstName > user2.firstName) { return true; }
    if (user1.firstName < user2.firstName) { return false; }
    if (user1.lastName > user2.lastName) { return true; }
    if (user1.lastName < user2.lastName) { return false; }
    return true;
  }

}
