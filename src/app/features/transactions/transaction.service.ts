import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponseTransactionDTO } from '../../shared/models/paged-response-transaction-dto.model';
import { TransactionDTO } from '../../shared/models/transaction-dto.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private api = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(this.api);
  }

  getPaginated(params: any): Observable<PagedResponseTransactionDTO> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get<PagedResponseTransactionDTO>(`${this.api}/paged`, { params: httpParams });
  }

  create(transaction: TransactionDTO): Observable<TransactionDTO> {
    return this.http.post<TransactionDTO>(this.api, transaction);
  }

  update(transactionId: number, transaction: TransactionDTO): Observable<TransactionDTO> {
    return this.http.put<TransactionDTO>(`${this.api}/${transactionId}`, transaction);
  }

  delete(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${transactionId}`);
  }

  getSummary(start: string, end: string): Observable<any> {
    return this.http.get(`${this.api}/summary`, {
      params: { start, end }
    });
  }

  getCategoryMonthlySummary(month: string): Observable<any> {
    return this.http.get(`${this.api}/category-summary`, {
      params: { month }
    });
  }
}
