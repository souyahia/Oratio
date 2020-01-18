import { Injectable } from '@angular/core';

import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';

import { clientToken, devToken } from '../../../../apikeys/dialogFlow';
import { UserInfo } from '../../../../oratio/src/app/services/user.service';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _messageList: Message[] = [];
  private _client: ApiAiClient;

  constructor(
    private tts: TextToSpeech,
  ) {
    this.client = new ApiAiClient( { accessToken: devToken } );
  }

  public static getDialogflowOptions(userInfo: UserInfo): any {
    const options = {
      contexts: [{
        name: "oauth2", 
        lifespan: 1,
        parameters: {
          userInfo: userInfo
        }
      }]
    };
    return options;
  }

  public addMessage(message: Message): void {
    this.messageList.push(message);
    if (!message.isFromUser) { this.readMessageTTS(message); }
  }

  public readMessageTTS(message: Message): void {
    this.tts.speak({text: message.htmlContent, locale: 'fr-FR'})
    .then(
      (res: any) => {},
      (err: any) => { console.error(`MessageService::readMessageTTS > Error when reading message : ${err}`) }
    );
  }

  public get messageList(): Message[] { return this._messageList; }
  public get client(): ApiAiClient { return this._client; }

  public set messageList(value: Message[]) { this._messageList = value; }
  public set client(value: ApiAiClient) { this._client = value; }

}
