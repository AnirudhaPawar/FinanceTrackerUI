import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTransactionListComponent } from './recurring-transaction-list.component';

describe('RecurringTransactionListComponent', () => {
  let component: RecurringTransactionListComponent;
  let fixture: ComponentFixture<RecurringTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringTransactionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
