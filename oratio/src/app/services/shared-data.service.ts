import { Injectable } from '@angular/core';

import { UserInfo } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  public signInUser: UserInfo;

  constructor() { }
}
