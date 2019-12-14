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

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cloudFunctions: CloudFunctionsService
  ) { }

  ngOnInit() { this.updateState(); }
  ionViewWillEnter() { this.updateState(); }

  updateState() {
    if (!this.loginService.isLoggedIn()) { this.router.navigateByUrl('/home'); }
    this.userInfo = this.loginService.loggedUser;
  }

  onClickSend() {
    this.router.navigateByUrl('/loading');
    console.log('Sending...')
    this.cloudFunctions.updateUser(this.userInfo)
    .subscribe((response) => {
      console.log(response);
      this.router.navigateByUrl('/settings');
    });
  }

  isValidUser() {
    if (this.userInfo.firstName === undefined) { return false; }
    if (this.userInfo.firstName.length === 0) { return false; }
    if (this.userInfo.lastName === undefined) { return false; }
    if (this.userInfo.lastName.length === 0) { return false; }
    if (this.userInfo.cellphone === undefined) { return false; }
    if (this.userInfo.cellphone.length === 0) { return false; }
    if (this.userInfo.birth === undefined) { return false; }
    const reg = new RegExp('^([\\d]{2})/([\\d]{2})/([\\d]{4})$', 'i');
    const result = this.userInfo.birth.match(reg);
    if (result === null || result === undefined) { return false; }
    const day: number = Number(result[1]);
    const month: number = Number(result[2]);
    const year: number = Number(result[3]);
    if (day === null || day === undefined) { return false; }
    if (month === null || month === undefined) { return false; }
    if (year === null || year === undefined) { return false; }
    if (year >= 2019) { return false; }
    if (month < 1 || month > 12) { return false; }
    let max: number = 31;
    if (month === 2) { max = 28; }
    if (month === 4 || month === 6 || month === 9 || month === 11) { max = 30; }
    return (day > 0 && day <= max);
  }

}
