import { CategoryDTO } from './category-dto.model';

export interface BudgetDTO {
  id?: number;
  userId?: number;
  categoryId?: number;
  category?: CategoryDTO;
  month?: string;
  amount?: number;
}