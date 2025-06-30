import { User } from './user.model';
import { Category } from './category.model';
import { Frequency } from './frequency.enum';
import { TransactionType } from './transaction-type.enum';

export interface RecurringTransaction {
  id?: number;
  user?: User;
  category?: Category;
  type?: TransactionType;
  amount?: number;
  note?: string;
  frequency?: Frequency;
  startDate?: string;
  endDate?: string;
  nextDueDate?: string;
  active?: boolean;
  createdAt?: string;
}
