import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { UserDTO } from '../../shared/models/user-dto.model';

export interface AuthRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:8080/api/auth/login';
  private userSubject = new BehaviorSubject<UserDTO | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(data: AuthRequest): Observable<any> {
    return this.http.post(this.api, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        const decodedToken = jwtDecode<{ userId: number }>(response.token);
        localStorage.setItem('userId', decodedToken.userId.toString());
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: UserDTO) {
    this.userSubject.next(user);
  }

  getUser(): UserDTO | null {
    return this.userSubject.getValue();
  }

}
