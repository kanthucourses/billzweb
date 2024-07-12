import { TestBed } from '@angular/core/testing';

import { ServiceMasterWebSocketService } from './service-master-web-socket.service';

describe('ServiceMasterWebSocketService', () => {
  let service: ServiceMasterWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMasterWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
