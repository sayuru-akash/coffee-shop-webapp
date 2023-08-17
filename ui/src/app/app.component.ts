import { Component } from '@angular/core';
import { WebsocketService } from './webSocket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Coffee Cafe';
  messages: Observable<{ type: string; message: string }[]>;

  constructor(private websocketService: WebsocketService) {
    this.messages = this.websocketService.getMessages();
    console.log(this.messages);
  }

  sendMessage(message: string): void {
    this.websocketService.sendMessage(message);
  }
}
