import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { UserInfo, UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  private supervision: string[]

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router
  ) {
    this.supervision = [];
  }

  ngOnInit() { this.updateState(); }
  ionViewWillEnter() { this.updateState(); }

  updateState() {
    if (!this.loginService.isLoggedIn()) { this.router.navigateByUrl('/home'); }
    this.supervision = this.loginService.loggedUser.supervision;
    console.log(this.supervision);
  }

  onClick() { console.log('click'); }

}
