import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';

import { NewUserInfo, LoginService } from '../services/login.service';
import { UserInfo } from '../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  private newUserInfo: NewUserInfo;
  private userInfo: UserInfo;
  private errorOnLoad: boolean;

  constructor(private loginService: LoginService, private alertController: AlertController) {
    this.errorOnLoad = false;
  }

  ngOnInit() {
    if (this.loginService.newUser === undefined) { this.errorOnLoad = true; }
    else {
      this.errorOnLoad = false;
      this.newUserInfo = this.loginService.newUser;
      this.userInfo = {
        access_token: this.newUserInfo.access_token,
        gmail: this.newUserInfo.gmail,
        username: this.newUserInfo.username,
        firstName: this.newUserInfo.firstName,
        lastName: this.newUserInfo.lastName,
        cellphone: '',
        birth: '',
        isHelper: true,
        supervision: []
      };
    }
  }

  async onClickCancel() {
    const alert = await this.alertController.create({
      header: 'Annulation',
      message: 'Êtes vous sûr de vouloir annuler votre inscription ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Oui',
          handler: () => { this.loginService.logout(); }
        }
      ]
    });

    await alert.present();
  }

  onClickSend() {
    this.loginService.logNewUser(this.userInfo);
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
