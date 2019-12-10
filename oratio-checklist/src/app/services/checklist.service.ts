import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface ChecklistItem {
  id: number,
  verb: string,
  object: string,
  done: boolean
}
 
export interface Checklist {
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