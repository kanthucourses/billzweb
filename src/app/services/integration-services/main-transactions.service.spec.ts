import { TestBed } from '@angular/core/testing';

import { MainTransactionsService } from './main-transactions.service';

describe('MainTransactionsService', () => {
  let service: MainTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
