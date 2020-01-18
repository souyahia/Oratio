import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, Subscribable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Checklist, ChecklistOperatorService } from '../services/checklist-operator.service';
import { FirestoreService } from '../services/firestore.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.page.html',
  styleUrls: ['./execute.page.scss'],
})
export class ExecutePage implements OnInit {

  private _checklist: Checklist;
  private _checklistSubscription: Subscription;

  private _userParam: string;
  private _nameParam: string;
  private _paramSubscription: Subscription;

  private _isError: boolean = false;
  private _isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: FirestoreService,
    private operator: ChecklistOperatorService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this._paramSubscription = this.route.paramMap
    .subscribe((params: Params) => {
      this.userParam = params.get('user');
      this.nameParam = params.get('name');
      this._checklistSubscription = this.firestore.queryChecklists(this.userParam, this.nameParam)
      .subscribe((checklists: Checklist[]) => {
        this.isLoading = false;
        this.isError = false;
        this.checklist = checklists[0];
        this.operator.sortItems(this.checklist);
      }, (err: any) => {
        this.isLoading = false;
        this.isError = true;
        console.log(`ExecutePage::ngOnInit > Unexpected error : ${JSON.stringify(err)}`);
      });
    });
  }

  ngOnDestroy() {
    this._paramSubscription.unsubscribe();
    this._checklistSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.isError = false;
  }

  public onClickCheckbox(): void {
    this.firestore.setChecklist(this.checklist)
    .then((res: any) => {}, (err: any) => {
      console.error(`ExecutePage::onClickDone > Unexpected error : ${err}`);
      this.showErrorAlert();
    });
  }

  private async showErrorAlert(): Promise<any> {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });

    await alert.present();
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
