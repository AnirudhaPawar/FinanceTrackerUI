import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../budget.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BudgetDTO } from '../../../shared/models/budget-dto.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { format } from 'date-fns';

@Component({
  standalone: true,
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatInputModule, MatDatepicker
  ],
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {
  budgets: BudgetDTO[] = [];
  selectedMonth: Date = new Date();
  displayedMonth: string = '';

  constructor(private budgetService: BudgetService, private router: Router) {}

  ngOnInit(): void {
    this.loadBudgetsForSelectedMonth();
  }

  onMonthChange(): void {
    this.loadBudgetsForSelectedMonth();
  }

  onMonthSelected(event: Date, datepicker: any): void {
    this.selectedMonth = new Date(event.getFullYear(), event.getMonth(), 1);
    datepicker.close();
    this.loadBudgetsForSelectedMonth();
  }
  

  loadBudgetsForSelectedMonth(): void {
    const year = this.selectedMonth.getFullYear();
    const month = (this.selectedMonth.getMonth() + 1).toString().padStart(2, '0');
    const formattedMonth = `${year}-${month}`;
    this.displayedMonth = format(this.selectedMonth, 'MMMM yyyy');
    this.budgetService.getByMonth(formattedMonth).subscribe(b => {
      this.budgets = b;
    });
  }

  prevMonth(): void {
    this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() - 1, 1);
    this.loadBudgetsForSelectedMonth();
  }
  
  nextMonth(): void {
    this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 1);
    this.loadBudgetsForSelectedMonth();
  }

  add(): void {
    this.router.navigate(['/budgets/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/budgets/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.delete(id).subscribe(() => this.loadBudgetsForSelectedMonth());
    }  
  }
}
