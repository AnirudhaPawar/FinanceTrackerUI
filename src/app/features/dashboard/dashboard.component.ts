// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../transactions/transaction.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { format } from 'date-fns';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { BudgetService } from '../budgets/budget.service';
import { BudgetSummary } from '../../shared/models/budget-summary.model';
import { CategoryMonthlySummaryDTO } from '../../shared/models/category-monthly-summary-dto.model';
import { InsightsService } from '../insights/insights.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatTableModule, MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  summary: any = {};
  categorySummary: CategoryMonthlySummaryDTO[] = [];
  recentTransactions: any[] = [];
  pieChartLabels: string[] = [];
  currentMonth: Date = new Date();
  displayedMonth: string = '';
  budgetSummary: BudgetSummary[] = [];
  hasChartData = false;
  insights: string[] = [];

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  constructor(private transactionService: TransactionService,
    private budgetService: BudgetService,
    private insightsService: InsightsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.insightsService.getUserInsights().subscribe({
      next: (data) => this.insights = data,
      error: (err) => console.error('Insight loading failed', err)
    });
  }

  generateColors(count: number): string[] {
    const colors = [
      '#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0',
      '#00bcd4', '#8bc34a', '#ffc107', '#e91e63', '#3f51b5'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }

  loadDashboardData(): void {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1).toISOString();
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString();
  
    this.displayedMonth = format(this.currentMonth, 'MMMM yyyy');
  
    this.transactionService.getSummary(start, end).subscribe(data => {
      this.summary = data;
    });
  
    const month = `${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
  
      this.transactionService.getCategoryMonthlySummary(month).subscribe(data => {
        this.categorySummary = data;

        this.pieChartLabels = data.map(d=> d.categoryName!);
        const chartData: number[] = data.map(d => d.totalAmount!);
      
        this.pieChartData.labels = this.pieChartLabels;
        this.pieChartData.datasets[0].data = chartData;
        this.pieChartData.datasets[0].backgroundColor = this.generateColors(data.length);
      
        this.hasChartData = chartData.some((val: number) => val > 0);
      });
      
  
    this.transactionService.getAll().subscribe(data => {
      const currentMonthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1).getTime();
      const currentMonthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getTime();
      this.recentTransactions = data
        .filter((t: any) => {
          const txDate = new Date(t.createdDate).getTime();
          return txDate >= currentMonthStart && txDate <= currentMonthEnd;
        })
        .slice(0, 5);
    });

    this.budgetService.getSummary(month).subscribe(data => {
      this.budgetSummary = data;
    });
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.loadDashboardData();
  }
  
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.loadDashboardData();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'within budget':
        return 'status-green';
      case 'over budget':
        return 'status-red';
      case 'under budget':
        return 'status-orange'; // optional
      default:
        return '';
    }
  }
  
  
}
