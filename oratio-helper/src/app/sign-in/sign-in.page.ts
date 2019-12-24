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
  private userBirth: string;
  private maxDate: string = new Date().toISOString();

  constructor(private loginService: LoginService, private alertController: AlertController) {
    this.errorOnLoad = false;
    this.userBirth = '';
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
    const date = new Date(this.userBirth);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    this.userInfo.birth = `${dd}/${mm}/${yyyy}`;
    this.loginService.logNewUser(this.userInfo);
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
