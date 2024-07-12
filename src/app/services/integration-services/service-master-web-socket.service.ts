import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMasterWebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    // Replace the URL with your WebSocket server URL
    this.socket$ = webSocket('ws://localhost:9988/api/websocket');
  }

  // Method to connect to WebSocket server and subscribe to serviceMasters updates
  getServiceMasters(): Observable<any[]> {
    return this.socket$.multiplex(
      () => ({ subscribe: '/app/serviceMasters' }), // Subscribe to /app/serviceMasters destination
      () => ({ unsubscribe: '/app/serviceMasters' }), // Unsubscribe from /app/serviceMasters destination
      message => message.destination === '/topic/serviceMasters' // Filter messages for /topic/serviceMasters
    );
  }
}
