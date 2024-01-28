import {  EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventBusServiceService {
  private eventBus = new EventEmitter();

  emit(eventName: string, data?: any) {
    this.eventBus.emit({ eventName, data });
  }

  on(eventName: string, handler: (event: { eventName: string, data?: any }) => void) {
    this.eventBus.subscribe((event: { eventName: string, data?: any }) => {
      if (event.eventName === eventName) {
        handler(event);
      }
    });
  }
  
  constructor() { }

}
