import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecurringTransaction } from '../../../shared/models/recurring-transaction.model';
import { RecurringTransactionService } from '../recurring-transaction.service';
import { RecurringTransactionDTO } from '../../../shared/models/recurring-transaction-dto.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'app-recurring-transaction-list',
  templateUrl: './recurring-transaction-list.component.html',
  styleUrls: ['./recurring-transaction-list.component.scss'] ,
  imports: [CommonModule, MatCardModule, MatFormFieldModule,
    MatListModule,
    MatButtonModule,
    MatIconModule, MatTableModule]
})
export class RecurringTransactionListComponent implements OnInit {
  transactions: RecurringTransactionDTO[] = [];
  displayedColumns = ['category', 'amount', 'type', 'frequency', 'nextDueDate', 'actions'];

  constructor(private service: RecurringTransactionService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe({
      next: (data: RecurringTransactionDTO[]) => this.transactions = data,
      error: (err: any) => console.error(err)
    });
  }

  add() {
    this.router.navigate(['/recurring-transactions/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/recurring-transactions/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
