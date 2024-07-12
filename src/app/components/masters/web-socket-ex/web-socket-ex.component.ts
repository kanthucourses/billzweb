import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/integration-services/socket.service';

@Component({
  selector: 'app-web-socket-ex',
  templateUrl: './web-socket-ex.component.html',
  styleUrls: ['./web-socket-ex.component.scss']
})
export class WebSocketExComponent implements OnInit {
  serviceMasters: any[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.initializeWebSocketConnection();
    
  }


}
