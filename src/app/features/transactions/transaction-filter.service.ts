import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TransactionFilterService {
  selectedMonth: string | null = null;
  selectedFilter: string = 'current';
  customMonth: string = '';
  selectedCategoryId: number | null = null;
  selectedType: string | null = null;
  scrollPosition = 0;
}
