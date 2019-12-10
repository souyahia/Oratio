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

  static sortChecklist(checklist: Checklist): Checklist {
    if (checklist == null) { return null; }
    let sorted: Checklist = {
      user: checklist.user,
      name: checklist.name,
      items: null
    };

    if (checklist.items == null) { return sorted; }
    sorted.items = [];
    if (checklist.items.length == 0) { return sorted; }

    for (let id = 0; id<checklist.items.length; id++)
      for (let item of checklist.items)
        if (item.id == id) { sorted.items.push(item); }

    return sorted;
  }

}