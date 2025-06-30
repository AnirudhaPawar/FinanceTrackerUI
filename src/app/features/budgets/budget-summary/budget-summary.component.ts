import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetSummary } from '../../../shared/models/budget-summary.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // or MatMomentDateModule

@Component({
  standalone: true,
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss'],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, 
    MatCardModule, MatTableModule, MatDatepickerModule, MatNativeDateModule]
})
export class BudgetSummaryComponent implements OnInit {
  summary: BudgetSummary[] = [];
  month: Date = new Date();
  displayedColumns: string[] = ['category', 'budgeted', 'spent', 'remaining', 'status'];

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.fetchSummary();
  }

  fetchSummary(): void {
    const monthString = `${this.month.getFullYear()}-${String(this.month.getMonth() + 1).padStart(2, '0')}`;
    this.budgetService.getSummary(monthString).subscribe(data => this.summary = data);
  }

  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    this.month = normalizedMonth;
    this.fetchSummary();
    datepicker.close();
  }
  
}
