import { CategoryDTO } from './category-dto.model';
import { TransactionType } from './transaction-type.enum';

export interface TransactionDTO {
  id?: number;
  amount?: number;
  category?: CategoryDTO;
  createdDate?: string;
  userId?: number;
  type?: TransactionType;
  note?: string;
  tags?: string[];
}
