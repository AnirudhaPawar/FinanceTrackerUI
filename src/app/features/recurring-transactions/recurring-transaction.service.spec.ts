import { TestBed } from '@angular/core/testing';
import { RecurringTransactionService } from './recurring-transaction.service';

describe('RecurringTransactionService', () => {
  let service: RecurringTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecurringTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
