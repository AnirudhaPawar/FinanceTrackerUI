import { Component } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-transaction-category-summary',
  templateUrl: './transaction-category-summary.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class TransactionCategorySummaryComponent {
  form: FormGroup;
  summary: any[] = [];

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.form = this.fb.group({
      month: ['']
    });
  }

  fetchSummary(): void {
    const month = this.form.value.month;
    this.transactionService.getCategoryMonthlySummary(month).subscribe(data => {
      this.summary = data;
    });
  }
}
