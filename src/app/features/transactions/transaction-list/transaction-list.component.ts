import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { TransactionDTO } from '../../../shared/models/transaction-dto.model';
import { PagedResponseTransactionDTO } from '../../../shared/models/paged-response-transaction-dto.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TransactionFilterService } from '../transaction-filter.service';
import { ViewportScroller } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Category } from '../../../shared/models/category.model';
import { TransactionType } from '../../../shared/models/transaction-type.enum';
import { CategoryService } from '../../categories/category.service';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  standalone: true,
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  imports: [FormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatGridListModule, MatTableModule, MatIconModule,
      MatToolbarModule, MatButtonModule,
      MatDividerModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatNativeDateModule,
      MatSortModule]
})
export class TransactionListComponent implements OnInit {
  transactions: TransactionDTO[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  selectedMonth: string = ''; // Format: YYYY-MM
  monthsList: string[] = [];
  monthOptions: string[] = [];
  customMonth: string = '';
  showCustomMonth = false;
  selectedFilter: string = 'current';
  customMonthDate: Date | null = null;
  categories: Category[] = [];
  types = TransactionType;
  transactionTypes: string[] = Object.values(TransactionType);
  selectedCategoryId: number | null = null;
  selectedType: string | null = null;
  sortBy = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';
  displayedColumns = ['date', 'type', 'amount', 'category', 'note', 'actions'];
  displayedMonth: string = '';


  constructor(private transactionService: TransactionService, private router: Router,
    private filterService: TransactionFilterService,
    private categoryService: CategoryService,
    private viewportScroller: ViewportScroller) {}

    ngOnInit(): void {
      this.selectedFilter = this.filterService.selectedFilter || 'current';
      this.customMonth = this.filterService.customMonth || '';
      this.selectedCategoryId = this.filterService.selectedCategoryId ?? null;
      this.selectedType = this.filterService.selectedType ?? null;

      if (this.selectedFilter === 'custom' && this.customMonth) {
        this.selectedMonth = this.customMonth;
      } else {
        this.selectedMonth = this.getCurrentMonth();
      }
      this.updateDisplayedMonth();

      this.loadCategories();

      if (this.selectedFilter) {
        this.applyFilters();
      } else {
        this.loadTransactions();
      }

      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, this.filterService.scrollPosition]);
      }, 0);
    }

    updateDisplayedMonth(): void {
      if (!this.selectedMonth) {
        this.displayedMonth = '';
        return;
      }
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      this.displayedMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    

    onSort(sort: Sort): void {
      this.sortBy = sort.active;
      this.sortDir = sort.direction || 'asc';
      this.page = 0;
      this.loadTransactions();
    }

    prevMonth(): void {
      if (!this.selectedMonth) {
        this.selectedMonth = this.getCurrentMonth();
      }
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const date = new Date(year, month - 2, 1);
      this.selectedMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      this.updateDisplayedMonth();
      this.loadTransactionsForSelectedMonth();
    }
    
    nextMonth(): void {
      if (!this.selectedMonth) {
        this.selectedMonth = this.getCurrentMonth();
      }
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const date = new Date(year, month, 1);
      this.selectedMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      this.updateDisplayedMonth();
      this.loadTransactionsForSelectedMonth();
    }

    loadTransactionsForSelectedMonth(): void {
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const startDate = this.formatDate(new Date(year, month - 1, 1));
      const endDate = this.getLastDayOfMonth(year, month - 1);
      this.loadTransactions(startDate, endDate);
    }

    loadCategories(): void {
      this.categoryService.getAll().subscribe({
        next: (cats) => this.categories = cats,
        error: (err) => console.error('Failed to load categories', err)
      });
    }
    
  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  generateMonthOptions(): void {
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      this.monthOptions.push(m);
    }
  }

  applyFilters(): void {
    this.selectedFilter = this.filterService.selectedFilter || 'current';
    this.customMonth = this.filterService.customMonth || '';
    this.onFilterChange();
  }
  

  onFilterChange(): void {
    this.showCustomMonth = this.selectedFilter === 'custom';
  
    // Save filter state
    this.filterService.selectedFilter = this.selectedFilter;
    this.filterService.customMonth = this.customMonth;
    this.filterService.selectedCategoryId = this.selectedCategoryId;
    this.filterService.selectedType = this.selectedType;
  
    const now = new Date();
    let startDate: string | null = null;
    let endDate: string | null = null;
  
    switch (this.selectedFilter) {
      case 'current':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
        endDate = this.getLastDayOfMonth(now.getFullYear(), now.getMonth());
        break;
    
      case 'last1':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
        endDate = this.getLastDayOfMonth(now.getFullYear(), now.getMonth() - 1);
        break;
    
      case 'last3':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth() - 2, 1));
        endDate = this.getLastDayOfMonth(now.getFullYear(), now.getMonth());
        break;
    
      case 'last6':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth() - 5, 1));
        endDate = this.getLastDayOfMonth(now.getFullYear(), now.getMonth());
        break;
    
      case 'last12':
        startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth() - 11, 1));
        endDate = this.getLastDayOfMonth(now.getFullYear(), now.getMonth());
        break;
    
      case 'custom':
        if (this.customMonth) {
          const [year, month] = this.customMonth.split('-').map(Number);
          startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
          endDate = this.getLastDayOfMonth(year, month - 1);
        }
        break;
    }
    

    if (this.selectedFilter === 'custom' && this.customMonth) {
      this.selectedMonth = this.customMonth;
    } else if (this.selectedFilter !== 'custom') {
      this.selectedMonth = this.getCurrentMonth();
    }
    this.updateDisplayedMonth();
  
    if (startDate && endDate) {
      this.loadTransactions(startDate, endDate);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}-01`;
  }
  
  private getLastDayOfMonth(year: number, month: number): string {
    const lastDay = new Date(year, month + 1, 0); // 0 = last day of previous month
    const yyyy = lastDay.getFullYear();
    const mm = (lastDay.getMonth() + 1).toString().padStart(2, '0');
    const dd = lastDay.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  generateLast12Months(): void {
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
      this.monthsList.push(monthStr);
    }
  }

  loadTransactions(startDate?: string, endDate?: string): void {
    const params: any = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      categoryId: this.selectedCategoryId,
      type: this.selectedType
    };
  
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    console.log(params)
  
    this.transactionService.getPaginated(params)
      .pipe(catchError(err => throwError(() => err)))
      .subscribe(res => {
        this.transactions = res.content || [];
        this.totalPages = res.totalPages || 0;
      });
  }
  

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadTransactions();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadTransactions();
    }
  }

  add(): void {
    this.router.navigate(['/transactions/new']);
  }

  edit(transactionId: number): void {
    this.filterService.selectedMonth = this.selectedMonth;
    this.filterService.scrollPosition = window.scrollY;
    this.router.navigate(['/transactions/edit', transactionId]);
  }

  delete(transactionId: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.delete(transactionId).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  onMonthChange(): void {
    if (this.selectedFilter === 'custom') {
      this.onFilterChange();
    }
  }

  onMonthSelected(event: Date, datepicker: any): void {
    this.customMonthDate = event;
    this.customMonth = `${event.getFullYear()}-${(event.getMonth() + 1).toString().padStart(2, '0')}`;
    this.filterService.customMonth = this.customMonth;
    datepicker.close();
    this.onFilterChange();
  }
  
  onCustomMonthSelected(event: any): void {
    // For safety - ensure consistent formatting
    if (event.value) {
      const d = new Date(event.value);
      this.customMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      this.customMonthDate = d;
      this.onFilterChange();
    }
  }
  
  

}
