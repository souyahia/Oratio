import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface UserInfo {
  id?: string,
  cellphone: string,
  birth: string,
  firstname: string,
  lastname: string,
  gmail: string,
  username: string,
  password?: string,
  isHelper: boolean,
  supervision?: string[],
  helper?: string,
  access_token: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: Observable<UserInfo[]>;
  private userCollection: AngularFirestoreCollection<UserInfo>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = this.afs.collection<UserInfo>('Users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUsers(): Observable<UserInfo[]> {
    return this.users;
  }
 
  getUserByDocumentId(id: string): Observable<UserInfo> {
    return this.userCollection.doc<UserInfo>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = id;
        return idea
      })
    );
  }

  queryByUsername(username: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('username', '==', username))
      .valueChanges();
  }

  queryByGmail(gmail: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('gmail', '==', gmail))
      .valueChanges();
  }
}
