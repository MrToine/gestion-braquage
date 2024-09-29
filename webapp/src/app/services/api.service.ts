import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}/users`);
  }

  getUser(id: string) {
    return this.http.get(`${this.API_URL}/users/${id}`);
  }

  createUser(user: any) {
    return this.http.post(`${this.API_URL}/users/create`, user);
  }

  updateUser(id: string, user: any) {
    return this.http.patch(`${this.API_URL}/users/${id}`, user);
  }
  
  updateRoleUser(id: string, role: any) {
    console.log(`reçu pour route : ${this.API_URL}/users/role/${id}`);
    return this.http.patch(`${this.API_URL}/users/role/${id}`, { role });
  }

  desactivateUser(id: string) {
    return this.http.patch(`${this.API_URL}/users/${id}`, { isActive: false });
  }

  activateUser(id: string) {
    return this.http.patch(`${this.API_URL}/users/${id}`, { isActive: true });
  }

  getAllHeists() {
    return this.http.get(`${this.API_URL}/heists`);
  }

  getHeist(id: string) {
    return this.http.get(`${this.API_URL}/heists/${id}`);
  }

  createHeist(heist: any) {
    return this.http.post(`${this.API_URL}/heists/create`, heist);
  }

  deleteHeist(id: string) {
    return this.http.delete(`${this.API_URL}/heists/delete/${id}`);
  }

  postUserHeist(userId: string, heistId: string) {
    console.log(`reçu pour route : ${this.API_URL}/users/${userId}/heist/${heistId}`);
    return this.http.post(`${this.API_URL}/users/${userId}/heist/${heistId}`, {});
  }

  getAllPosts() {
    return this.http.get(`${this.API_URL}/posts`);
  }

  getPost(id: string) {
    return this.http.get(`${this.API_URL}/posts/${id}`);
  }

  createPost(post: any) {
    return this.http.post(`${this.API_URL}/posts/create`, post);
  }

  deletePost(id: string) {
    return this.http.delete(`${this.API_URL}/posts/delete/${id}`);
  }

  updatePost(id: string, post: any) {
    console.log(`reçu pour route : ${this.API_URL}/posts/${id}, ${post.content}`);
    return this.http.patch(`${this.API_URL}/posts/${id}`, post);
  }

  //connexion
  login(credentials: any) {
    return this.http.post(`${this.API_URL}/users/login`, credentials);
  }

  deconnexion() {
    return this.http.get(`${this.API_URL}/users/logout`);
  }
}
