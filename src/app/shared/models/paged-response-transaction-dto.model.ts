import { TransactionDTO } from './transaction-dto.model';

export interface PagedResponseTransactionDTO {
  content?: TransactionDTO[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
}
