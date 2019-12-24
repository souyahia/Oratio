import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { SharedDataService } from '../services/shared-data.service';
import { UserInfo, UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-helper',
  templateUrl: './search-helper.page.html',
  styleUrls: ['./search-helper.page.scss'],
})
export class SearchHelperPage implements OnInit {

  private userInfo: UserInfo;
  private userInput: string = '';
  private isLoading: boolean = false;
  private afsSubscription: Subscription;
  private helpers: UserInfo[];
  private resultHelpers: UserInfo[];

  constructor(
    private alertController: AlertController,
    private loginService: LoginService,
    private sharedDataService: SharedDataService,
    private userService: UserService
  ) { }

  ngOnInit() { this.updateData(); }

  ionViewWillEnter() { this.updateData(); }

  ngOnDestroy() { this.afsSubscription.unsubscribe(); }

  updateData() {
    this.userInfo = this.sharedDataService.signInUser;
    this.isLoading = true;
    this.afsSubscription = this.userService.getHelpers()
    .subscribe((helpers: UserInfo[]) => {
      this.isLoading = false;
      this.helpers = this.userService.sortUsersByName(helpers);
      this.resultHelpers = [];
      for (let helper of this.helpers) { this.resultHelpers.push(helper); }
    });
  }

  async onClickHelper(helper: UserInfo) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Voulez-vous sélectionner ${helper.firstName} ${helper.lastName} comme aidant ?`,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Oui',
          handler: () => { this.selectHelper(helper); }
        }
      ]
    });

    await alert.present();
  }

  selectHelper(helper: UserInfo) {
    this.userInfo.helper = helper.username;
    this.loginService.logNewUser(this.userInfo);
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

  onSearch($event) {
    let input = ($event !== null) ? $event.target.value : this.userInput;
    if (input === null || input === undefined) { this.resultHelpers = this.helpers; }
    else if (input.length === 0) { this.resultHelpers = this.helpers; }
    else {
      let searchResult: UserInfo[] = [];
      for (let user of this.helpers) {
        if (this.isUserMatchingInput(user, input)) { searchResult.push(user) }
      }
      this.resultHelpers = searchResult;
    }
  }

  isUserMatchingInput(user: UserInfo, input: string): boolean {
    let upperInput: string = input.toUpperCase();
    if (user.firstName.toUpperCase().startsWith(upperInput)) { return true; }
    if (user.lastName.toUpperCase().startsWith(upperInput)) { return true; }
    let fullName: string = user.firstName + ' ' + user.lastName;
    if (fullName.toUpperCase().startsWith(upperInput)) { return true; }
    return false;
  }

}
