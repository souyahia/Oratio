import { Injectable } from '@angular/core';

export interface UserInfo {
  cellphone: string,
  birth: string,
  firstname: string,
  lastname: string,
  gmail: string,
  username: string,
  password?: string,
  isHelper: boolean,
  supervision?: string[],
  helper?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
}
