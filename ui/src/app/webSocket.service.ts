import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  private readonly SERVER_URL = 'ws://localhost:8080' ; // Replace with your actual WebSocket server URL

  constructor() {
    this.socket$ = new WebSocketSubject(this.SERVER_URL);
  }

  public sendMessage(message: string): void {
    this.socket$.next(message);
  }

  public getMessages() {
    return this.socket$;
  }
}
