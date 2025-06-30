import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class TransactionSummaryComponent implements OnInit {
  form: FormGroup;
  summary: any;

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.form = this.fb.group({
      start: [''],
      end: ['']
    });
  }

  ngOnInit(): void {}

  fetchSummary(): void {
    const startRaw = this.form.value.start;
    const endRaw = this.form.value.end;

    // Convert to ISO DateTime string
    const start = new Date(startRaw);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endRaw);
    end.setHours(23, 59, 59, 999);

    this.transactionService
      .getSummary(start.toISOString(), end.toISOString())
      .subscribe({
        next: (res) => (this.summary = res),
        error: (err) => console.error('Summary load failed', err)
      });
  }
}
