import { Injectable } from '@angular/core';

export interface Item {
  done: boolean,
  id: number,
  object: string,
  verb: string
}

export interface Checklist {
  items: Item[],
  name: string,
  user: string,
  id?: string
}

@Injectable({
  providedIn: 'root'
})
export class ChecklistOperatorService {

  constructor() { }

  public getIndexOfId(checklist: Checklist, id: number): number {
    for (let index=0; index<checklist.items.length; index++) {
      if (checklist.items[index].id == id) { return index; }
    }
    return -1;
  }

  public isUpAvailable(checklist: Checklist, id: number): boolean {
    const index = this.getIndexOfId(checklist, id);
    if (index === -1) { return false; }
    return index > 0;
  }

  public isDownAvailable(checklist: Checklist, id: number): boolean {
    const index = this.getIndexOfId(checklist, id);
    if (index === -1) { return false; }
    return index < checklist.items.length - 1;
  }

  public moveItemUp(checklist: Checklist, id: number): void {
    const index = this.getIndexOfId(checklist, id);
    if (index <= 0 || index >= checklist.items.length) { return; }
    const item: Item = checklist.items[index - 1];
    checklist.items[index - 1] = checklist.items[index];
    checklist.items[index] = item;
  }

  public moveItemDown(checklist: Checklist, id: number): void {
    const index = this.getIndexOfId(checklist, id);
    if (index < 0 || index >= checklist.items.length - 1) { return; }
    const item: Item = checklist.items[index + 1];
    checklist.items[index + 1] = checklist.items[index];
    checklist.items[index] = item;
  }

  public removeItem(checklist: Checklist, id: number): void {
    const index = this.getIndexOfId(checklist, id);
    if (index < 0 || index > checklist.items.length - 1) { return; }
    checklist.items.splice(index, 1);
  }

  public setItemsId(checklist: Checklist): void {
    if (checklist.items.length === 0) { return; }
    for (let index=0; index<checklist.items.length; index++) { checklist.items[index].id = index; }
  }

  public sortItems(checklist: Checklist): void { checklist.items = checklist.items.sort( this.compareItems ); }

  private compareItems(i1: Item, i2: Item): number {
    if (i1.id > i2.id) { return 1; }
    if (i1.id < i2.id) { return -1; }
    return 0
  }

}
