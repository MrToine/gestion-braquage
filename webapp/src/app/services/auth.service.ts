import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';


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
  private readonly API_URL = 'http://univers-toine.org/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();
  
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getHttpOptions() {
    const token = this.tokenService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Utilisation du jeton dynamique
      })
    };
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/${credentials.login}`, credentials, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response && response.token) {
            const user: User = {
              ...response.user,
              token: response.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.tokenService.setToken(response.token);
            this.currentUserSubject.next(user);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.API_URL}/users/logout`, this.getHttpOptions()).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.tokenService.removeToken();
        this.currentUserSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/refresh-token`, {}, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response && response.token) {
            const currentUser = this.currentUserValue;
            if (currentUser) {
              currentUser.token = response.token;
              this.tokenService.setToken(response.token);
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