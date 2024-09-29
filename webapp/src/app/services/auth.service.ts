import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


interface User {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  biography: string;
  phoneNumber: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/${credentials.login}`, credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            const user: User = {
              ...response.user,
              token: response.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.API_URL}/users/logout`).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/refresh-token`, {})
      .pipe(
        map(response => {
          if (response && response.token) {
            const currentUser = this.currentUserValue;
            if (currentUser) {
              currentUser.token = response.token;
            }
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.currentUserSubject.next(currentUser);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserValue;
    if (currentUser && currentUser.token) {
      return !this.jwtHelper.isTokenExpired(currentUser.token);
    }
    return false;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user != null && user.role === role;
  }

  getUserRole(): string | null {
    return this.currentUserValue?.role || null;
  }
}