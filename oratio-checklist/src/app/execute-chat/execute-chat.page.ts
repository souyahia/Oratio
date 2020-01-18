import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { FirestoreService } from '../services/firestore.service';
import { UserInfo } from '../../../../oratio/src/app/services/user.service';
import { MessageService } from '../services/message.service';
import { Message } from '../services/message';

@Component({
  selector: 'app-execute-chat',
  templateUrl: './execute-chat.page.html',
  styleUrls: ['./execute-chat.page.scss'],
})
export class ExecuteChatPage implements OnInit {

  private _userParam: string;
  private _nameParam: string;
  private _paramSubscription: Subscription;

  private _userInfo: UserInfo;

  private _userInput: string = '';
  private _isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: FirestoreService,
    private service: MessageService
  ) { }

  ngOnInit() {
    this._paramSubscription = this.route.paramMap
    .subscribe((params: Params) => {
      this.userParam = params.get('user');
      this.nameParam = params.get('name');
      this.firestore.queryUsers(this.userParam)
      .pipe(first()).subscribe((users: UserInfo[]) => {
        this.userInfo = users[0];
      });
    });
  }

  ngOnDestroy() { this._paramSubscription.unsubscribe(); }

  public onClickSend(): void {
    this.isLoading = true;
    this.sendMessageToService(this.userInput, true);
    this.sendMessageToDialogflow(this.userInput);
    this.resetUserInput();
  }

  private sendMessageToService(text: string, isFromUser: boolean): void {
    const message: Message = new Message(text, isFromUser);
    this.isLoading = false;
    this.service.addMessage(message);
  }

  private sendMessageToDialogflow(text: string): void {
    this.isLoading = true;
    const options = MessageService.getDialogflowOptions(this.userInfo);
    this.service.client.textRequest(text, options)
    .then(
      (res: any) => {
        this.handleDialogflowResponse(res);
        this.sendMessageToService(res.result.fulfillment.speech, false); 
      }, (err: any) => {
        console.error(`ExecuteChatPage::sendMessageToDialogflow > Unexpected error : ${err}`);
        this.sendMessageToService('Désolé, une erreur inattendue est survenue. Veuillez réessayer plus tard.', false);
      }
    );
  }

  private handleDialogflowResponse(response: any): void { }

  private resetUserInput(): void { this.userInput = ''; }

  public get userParam(): string { return this._userParam; }
  public get nameParam(): string { return this._nameParam; }
  public get userInfo(): UserInfo { return this._userInfo; }
  public get userInput(): string { return this._userInput; }
  public get isLoading(): boolean { return this._isLoading; }

  public set userParam(value: string) { this._userParam = value; }
  public set nameParam(value: string) { this._nameParam = value; }
  public set userInfo(value: UserInfo) { this._userInfo = value; }
  public set userInput(value: string) { this._userInput = value; }
  public set isLoading(value: boolean) { this._isLoading = value; }

}
