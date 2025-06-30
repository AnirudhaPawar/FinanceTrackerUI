import { Frequency } from './frequency.enum';
import { TransactionType } from './transaction-type.enum';

export interface RecurringTransactionDTO {
  userId?: number;
  categoryId: number;
  type: TransactionType;
  amount: number;
  note?: string;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  nextDueDate?: string;
  active?: boolean;
  categoryName?: string;
  id?: number
}
