import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecurringTransactionDTO } from '../../shared/models/recurring-transaction-dto.model';
import { RecurringTransaction } from '../../shared/models/recurring-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class RecurringTransactionService {
  private api = 'http://localhost:8080/api/recurring-transactions';

  constructor(private http: HttpClient) {}

  // GET all recurring transactions
  getAll(): Observable<RecurringTransactionDTO[]> {
    return this.http.get<RecurringTransactionDTO[]>(this.api);
  }

  getAllForUser(): Observable<RecurringTransactionDTO[]> {
    return this.http.get<RecurringTransactionDTO[]>(this.api+"/user");
  }

  // GET a single recurring transaction by ID
  getById(id: number): Observable<RecurringTransactionDTO> {
    return this.http.get<RecurringTransactionDTO>(`${this.api}/${id}`);
  }

  // POST a new recurring transaction
  create(dto: RecurringTransactionDTO): Observable<RecurringTransaction> {
    return this.http.post<RecurringTransaction>(this.api, dto);
  }

  // PUT (update) an existing recurring transaction
  update(id: number, dto: RecurringTransactionDTO): Observable<RecurringTransaction> {
    return this.http.put<RecurringTransaction>(`${this.api}/${id}`, dto);
  }

  // DELETE a recurring transaction by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
