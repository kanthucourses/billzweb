import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private stompClient: Stomp.Client | null = null;

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    /*
    const serverUrl = 'ws://localhost:9988/api'; // Replace with your server URL
    let ws = new SockJS(`${serverUrl}/websocket`);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function () {
      that.stompClient?.subscribe('/topic/serviceMasters', (message) => {
        console.log(message.body); // Handle the received data
      });
    });
    */
  }

}
