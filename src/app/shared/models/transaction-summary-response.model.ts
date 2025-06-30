export interface TransactionSummaryResponse {
    totalIncome?: number;
    totalExpense?: number;
    netSavings?: number;
    categoryWiseBreakdown?: { [categoryName: string]: number };
  }