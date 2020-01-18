export class Message {

  constructor(
      private _htmlContent: string = '',
      private _isFromUser: boolean = true,
      private _sendDate: Date = new Date()
  ) { }

  public get displayDate(): string {
    let hours: string = `${this.sendDate.getHours()}`;
    if (this.sendDate.getHours() < 10) { hours = `0${hours}`; }
    let minutes: string = `${this.sendDate.getMinutes()}`;
    if (this.sendDate.getHours() < 10) { minutes = `0${minutes}`; }
    return `${hours}:${minutes}`
  }

  public get htmlContent(): string { return this._htmlContent; }
  public get isFromUser(): boolean { return this._isFromUser; }
  public get sendDate(): Date { return this._sendDate; }

  public set htmlContent(value: string) { this._htmlContent = value; }
  public set isFromUser(value: boolean) { this._isFromUser = value; }
  public set sendDate(value: Date) { this._sendDate = value; }

}