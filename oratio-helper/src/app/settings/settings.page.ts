import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { UserInfo } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { CloudFunctionsService } from '../services/cloud-functions.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private userInfo: UserInfo;
  private userBirth: string;
  private maxDate: string = new Date().toISOString();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cloudFunctions: CloudFunctionsService
  ) {
    this.userBirth = '';
  }

  ngOnInit() { this.updateState(); }
  ionViewWillEnter() { this.updateState(); }

  updateState() {
    if (!this.loginService.isLoggedIn()) { this.router.navigateByUrl('/home'); }
    this.userInfo = this.loginService.loggedUser;
  }

  onClickSend() {
    this.router.navigateByUrl('/loading');
    const date = new Date(this.userBirth);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    this.userInfo.birth = `${dd}/${mm}/${yyyy}`;
    this.cloudFunctions.updateUser(this.userInfo)
    .subscribe((response) => {
      this.router.navigateByUrl('/settings');
    });
  }

  isValidUser() {
    if (this.userInfo.firstName === undefined || this.userInfo.firstName === null) { return false; }
    if (this.userInfo.firstName.length === 0) { return false; }
    if (this.userInfo.lastName === undefined || this.userInfo.lastName === null) { return false; }
    if (this.userInfo.lastName.length === 0) { return false; }
    if (this.userInfo.cellphone === undefined || this.userInfo.cellphone === null) { return false; }
    if (this.userInfo.cellphone.length === 0) { return false; }
    if (this.userBirth === undefined || this.userBirth === null) { return false; }
    return true;
  }

}
