import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}
  
  //Update User
  updateUserEmail(oldEmail: string, newEmail: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/update/${oldEmail}`, { email: newEmail });
  }
  
  //Change Password
  changePassword(userId: number, newPassword: string): Observable<any> {
    const body = { newPassword };
    return this.http.put(`${this.apiUrl}/change-password/${userId}`, body);
  }

  //Delete user
  deleteUser(id: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
}
