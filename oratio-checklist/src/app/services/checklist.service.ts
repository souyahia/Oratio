import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ChecklistItem {
  id: number,
  verb: string,
  object: string,
  done: boolean
}
 
export interface Checklist {
  id?: string,
  user: string,
  name: string,
  items: ChecklistItem[]
}
 
@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
 
  constructor(private afs: AngularFirestore) {}

  getChecklistsByUser(user: string): Observable<Checklist[]>{
    return this.afs.collection<Checklist>('Checklists',
      ref => ref.where('user', '==', user))
      .valueChanges();
  }

}