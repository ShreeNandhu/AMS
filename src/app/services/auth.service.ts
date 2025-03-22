import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Backend API URL

  constructor(private http: HttpClient, private router: Router) {}

  // Register User
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(error => throwError(() => error.error)) // Return backend error messages
    );
  }

  // Login User
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
  // Get User Details
  getUserDetails(id: number): Observable<{ email: string; phoneNumber: string }> {
    return this.http.get<{ email: string; phoneNumber: string }>(`${this.apiUrl}/${id}`);
  }

  // Save User Data in LocalStorage
  saveUserData(name: string, role: string, id: string) {
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
    localStorage.setItem('id', id);
  }

  // Get User Name
  getUserName(): string | null {
    return localStorage.getItem('name');
  }

  // Get User ID
  getId(): string | null {
    return localStorage.getItem('id');
  }

  // Get User Role
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // Check if User is Logged In
  isLoggedIn(): boolean {
    return !!localStorage.getItem('id'); // Check ID instead of name (more reliable)
  }

  // Logout and Clear Storage
  logout() {
    localStorage.clear(); // Clears all stored items
    this.router.navigate(['/login']);
  }
}
