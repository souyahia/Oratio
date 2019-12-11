import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public _isLoggedIn
  public currentUser;
  public currentHelper;

  constructor() {
    this._isLoggedIn = false;
  }

  public isLoggedIn() {
    return this._isLoggedIn;
    //return (this.currentUser != null);
  }
}
