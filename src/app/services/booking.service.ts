import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/bookings';

  constructor(private http: HttpClient) {}

  // Get Available Seats
  getAvailableSeats(flightId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/availableSeats/${flightId}`);
  }

  // Book Seats
  bookSeat(bookingData: {
    flightId: number;
    userId: number;
    seatNumber: number;
  }): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/book`, bookingData);
  }

  // Process Payment
  processPayment(
    bookingId: number,
    paymentMethod: string,
    amount: number
  ): Observable<string> {
    const paymentData = { bookingId, paymentMethod, amount };
    return this.http.post<string>(`${this.apiUrl}/processPayment`, paymentData);
  }

  //Get All Booking ( Admin )
  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Cancel Booking
  cancelBooking(bookingId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/cancel/${bookingId}`);
  }

  // Fetch the Booking Details for PArticular User
  getUserBookings(): Observable<any> {
    const userId = localStorage.getItem('id');
    if (!userId) {
      throw new Error('User ID not found in local storage');
    }
    return this.http.get(`${this.apiUrl}/user/${userId}`); // Convert to number
  }

  //Get thee Booking as Per Id
  getBookingById(bookingId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/id/${bookingId}`);
  }
}
