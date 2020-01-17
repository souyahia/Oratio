import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { FirestoreService } from '../services/firestore.service';
import { ChecklistOperatorService, Checklist } from '../services/checklist-operator.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  private _userParam: string;
  private _nameParam: string;
  private _paramSubscription: Subscription;

  private _checklist: Checklist;

  private _isError: boolean = false;
  private _isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public firestore: FirestoreService,
    private operator: ChecklistOperatorService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this._paramSubscription = this.route.paramMap
    .subscribe((params: Params) => {
      this.userParam = params.get('user');
      this.nameParam = params.get('name');
      this.firestore.queryChecklists(this.userParam, this.nameParam)
      .pipe(first()).subscribe((checklists: Checklist[]) => {
        this.isLoading = false;
        this.isError = false;
        this.checklist = checklists[0];
        this.operator.sortItems(this.checklist);
      }, (err: any) => {
        this.isLoading = false;
        this.isError = true;
        console.log(`EditPage::ngOnInit > Unexpected error : ${JSON.stringify(err)}`);
      });
    });
  }

  ngOnDestroy() { this._paramSubscription.unsubscribe(); }

  ionViewWillEnter() {
    this.isLoading = true;
    this.isError = false;
  }

  public onClickAdd(): void {
    let done: boolean = false;
    let id: number = this.checklist.items.length;
    let verb: string = this.firestore.verbs[0];
    let object: string = '';
    this.checklist.items.push({
      done: done,
      id: id,
      verb: verb,
      object: object
    });
  }

  public async onClickCancel(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Annulation',
      message: 'Êtes-vous sûr(e) de vouloir annuler ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        }, {
          text: 'Oui',
          handler: () => { this.router.navigateByUrl('/home'); }
        }
      ]
    });

    await alert.present();
  }

  public onClickDone(): void {
    if (!this.isValidChecklist()) { return; }
    this.isLoading = true;
    this.operator.setItemsId(this.checklist);
    this.firestore.setChecklist(this.checklist)
    .then((res: any) => {
      this.showDoneSuccessAlert();
    }, (err: any) => {
      console.error(`EditPage::onClickDone > Unexpected error : ${err}`);
      this.showDoneErrorAlert();
    });
  };

  private async showDoneSuccessAlert(): Promise<any> {
    const alert = await this.alertController.create({
      header: 'Succès',
      message: 'Checklist modifiée avec succès !',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.isLoading = false;
            this.router.navigateByUrl('/home');
          }
        }
      ]
    });

    await alert.present();
  }

  private async showDoneErrorAlert(): Promise<any> {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
      buttons: [
        {
          text: 'OK',
          handler: () => { this.isLoading = false; }
        }
      ]
    });

    await alert.present();
  }

  public onClickItemUp(id: number): void { this.operator.moveItemUp(this.checklist, id); }

  public onClickItemDown(id: number): void { this.operator.moveItemDown(this.checklist, id); }

  public async onClickItemRemove(id: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Suppression d\'item',
      message: 'Êtes-vous sûr(e) de vouloir supprimer cet item ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        }, {
          text: 'Oui',
          handler: () => { this.operator.removeItem(this.checklist, id); }
        }
      ]
    });

    await alert.present();
  }

  public isUpDisabled(id: number): boolean { return !this.operator.isUpAvailable(this.checklist, id); }

  public isDownDisabled(id: number): boolean { return !this.operator.isDownAvailable(this.checklist, id); }

  public isObjectValid(object: string): boolean {
    if (object === undefined) { return false; }
    return (object.length > 0);
  }

  public isValidChecklist(): boolean {
    if (this.checklist === undefined || this.checklist.items === undefined) { return false; }
    if (this.checklist.items.length === 0) { return false; }
    for (let item of this.checklist.items) {
      if (!this.isObjectValid(item.object)) { return false; }
    }
    return true;
  }

  public isEmptyItems(): boolean {
    if (this.checklist === undefined || this.checklist.items === undefined) { return true; }
    return this.checklist.items.length === 0;
  }

  public get userParam(): string { return this._userParam; }
  public get nameParam(): string { return this._nameParam; }
  public get checklist(): Checklist { return this._checklist; }
  public get isError(): boolean { return this._isError; }
  public get isLoading(): boolean { return this._isLoading; }

  public set userParam(value: string) { this._userParam = value; }
  public set nameParam(value: string) { this._nameParam = value; }
  public set checklist(value: Checklist) { this._checklist = value; }
  public set isError(value: boolean) { this._isError = value; }
  public set isLoading(value: boolean) { this._isLoading = value; }

}
