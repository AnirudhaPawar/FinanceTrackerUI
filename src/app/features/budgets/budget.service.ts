import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetDTO } from '../../shared/models/budget-dto.model';
import { BudgetSummary } from '../../shared/models/budget-summary.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private api = 'http://localhost:8080/api/budgets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BudgetDTO[]> {
    return this.http.get<BudgetDTO[]>(this.api);
  }

  getById(id: number): Observable<BudgetDTO> {
    return this.http.get<BudgetDTO>(`${this.api}/${id}`);
  }

  create(budget: BudgetDTO): Observable<BudgetDTO> {
    return this.http.post<BudgetDTO>(this.api, budget);
  }

  update(id: number, budget: BudgetDTO): Observable<BudgetDTO> {
    return this.http.put<BudgetDTO>(`${this.api}/${id}`, budget);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getSummary(month: string): Observable<BudgetSummary[]> {
    return this.http.get<BudgetSummary[]>(`${this.api}/summary`, {
      params: { month }
    });
  }

  getByMonth(month: string): Observable<BudgetDTO[]> {
    return this.http.get<BudgetDTO[]>(`${this.api}/by-month`, {
      params: { month }
    });
  }

}
