import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {

  private baseUrl = 'http://localhost:8080/api/insights';

  constructor(private http: HttpClient) {}

  getUserInsights(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl);
  }
}
