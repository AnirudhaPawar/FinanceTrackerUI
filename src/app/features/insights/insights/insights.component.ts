import { Component, OnInit } from '@angular/core';
import { InsightsService } from '../insights.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insights',
  standalone: true,
  templateUrl: './insights.component.html',
  imports: [CommonModule, MatCardModule, MatGridListModule, MatTableModule, MatIconModule,
      MatToolbarModule,
      MatDividerModule,
      MatButtonModule,
      NgChartsModule],
})
export class InsightsComponent implements OnInit {
  insights: string[] = [];

  constructor(private insightsService: InsightsService) {}

  ngOnInit(): void {
    this.insightsService.getUserInsights().subscribe({
      next: (data) => this.insights = data,
      error: (err) => console.error('Error fetching insights:', err)
    });
  }
}
