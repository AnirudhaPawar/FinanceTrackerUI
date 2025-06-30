import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTransactionFormComponent } from './recurring-transaction-form.component';

describe('RecurringTransactionFormComponent', () => {
  let component: RecurringTransactionFormComponent;
  let fixture: ComponentFixture<RecurringTransactionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringTransactionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
