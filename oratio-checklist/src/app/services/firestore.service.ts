import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Checklist } from '../services/checklist-operator.service';
import { UserInfo } from '../../../../oratio/src/app/services/user.service';

interface VerbDocument { verbs: string[] }

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _verbs: string[] = [];

  constructor(
    private afs: AngularFirestore
  ) {
    this.afs.collection<VerbDocument>('Verbs').valueChanges()
    .subscribe((documents: VerbDocument[]) => {
      this.verbs = documents[0].verbs;
    });
  }

  public getChecklist(id: string): Observable<Checklist> {
    return this.afs.collection<Checklist>('Checklists').doc<Checklist>(id).valueChanges().pipe(
      map((checklist: Checklist) => {
        checklist.id = id;
        return checklist
      })
    );
  }

  public queryChecklists(user: string, name: string): Observable<Checklist[]> {
    return this.afs.collection<Checklist>('Checklists',
      ref => ref.where('user', '==', user).where('name', '==', name))
      .snapshotChanges().pipe(
        map((actions: DocumentChangeAction<Checklist>[]) => {
          return actions.map((a: DocumentChangeAction<Checklist>) => {
            const data: Checklist = a.payload.doc.data();
            const id: string = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  public setChecklist(checklist: Checklist): Promise<void> {
    return this.afs.collection<Checklist>('Checklists')
      .doc<Checklist>(checklist.id).set(checklist);
  }

  public queryUsers(username: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('username', '==', username)).valueChanges();
  }

  public get verbs(): string[] { return this._verbs; }

  public set verbs(value: string[]) { this._verbs = value; }

}
