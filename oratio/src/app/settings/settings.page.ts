import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private loginService: LoginService
  ) { }

  ngOnInit() { }

  async onClickDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr(e) de vouloir supprimer définitivement votre compte ?',
      buttons: [
        {
          text: 'Annuler',
          cssClass: 'primary',
          handler: () => {}
        }, {
          text: 'Oui',
          cssClass: 'danger',
          handler: () => { this.loginService.deleteUserAccount(); }
        }
      ]
    });

    await alert.present();
  }

}
