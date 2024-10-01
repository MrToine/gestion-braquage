import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://univers-toine.org/api';
  
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHttpOptions() {
    const token = this.tokenService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Utilisation du jeton dynamique
      })
    };
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}/users`, this.getHttpOptions());
  }

  getUser(id: string) {
    return this.http.get(`${this.API_URL}/users/${id}`, this.getHttpOptions());
  }

  createUser(user: any) {
    return this.http.post(`${this.API_URL}/users/create`, user, this.getHttpOptions());
  }

  updateUser(id: string, user: any) {
    return this.http.patch(`${this.API_URL}/users/${id}`, user, this.getHttpOptions());
  }
  
  updateRoleUser(id: string, role: any) {
    console.log(`reçu pour route : ${this.API_URL}/users/role/${id}`, this.getHttpOptions());
    return this.http.patch(`${this.API_URL}/users/role/${id}`, { role }, this.getHttpOptions());
  }

  desactivateUser(id: string) {
    return this.http.patch(`${this.API_URL}/users/${id}`, { isActive: false }, this.getHttpOptions());
  }

  activateUser(id: string) {
    return this.http.patch(`${this.API_URL}/users/${id}`, { isActive: true }, this.getHttpOptions());
  }

  getAllHeists() {
    return this.http.get(`${this.API_URL}/heists`, this.getHttpOptions());
  }

  getHeist(id: string) {
    return this.http.get(`${this.API_URL}/heists/${id}`, this.getHttpOptions());
  }

  createHeist(heist: any) {
    return this.http.post(`${this.API_URL}/heists/create`, heist, this.getHttpOptions());
  }

  deleteHeist(id: string) {
    return this.http.delete(`${this.API_URL}/heists/delete/${id}`, this.getHttpOptions());
  }

  postUserHeist(userId: string, heistId: string) {
    console.log(`reçu pour route : ${this.API_URL}/users/${userId}/heist/${heistId}`, this.getHttpOptions());
    return this.http.post(`${this.API_URL}/users/${userId}/heist/${heistId}`, {}, this.getHttpOptions());
  }

  getAllPosts() {
    return this.http.get(`${this.API_URL}/posts`, this.getHttpOptions());
  }

  getPost(id: string) {
    return this.http.get(`${this.API_URL}/posts/${id}`, this.getHttpOptions());
  }

  createPost(post: any) {
    return this.http.post(`${this.API_URL}/posts/create`, post, this.getHttpOptions());
  }

  deletePost(id: string) {
    return this.http.delete(`${this.API_URL}/posts/delete/${id}`, this.getHttpOptions());
  }

  updatePost(id: string, post: any) {
    console.log(`reçu pour route : ${this.API_URL}/posts/${id}, ${post.content}`, this.getHttpOptions());
    return this.http.patch(`${this.API_URL}/posts/${id}`, post, this.getHttpOptions());
  }

  //connexion
  login(credentials: any) {
    return this.http.post(`${this.API_URL}/users/login`, credentials, this.getHttpOptions());
  }

  deconnexion() {
    return this.http.get(`${this.API_URL}/users/logout`, this.getHttpOptions());
  }
}
