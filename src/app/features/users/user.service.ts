import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../../shared/models/user-dto.model';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Create a new user
  createUser(user: User): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.api, user);
  }

  // Get all users
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.api);
  }

  update(id: number, user: User): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.api}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.api}/${id}`);
  }
}
