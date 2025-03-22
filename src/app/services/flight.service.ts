import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Flight {
  id: number;
  source: string;
  destination: string;
  date: string;
  airline: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  availableSeats: number;
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:8080/flights';
  constructor(private http: HttpClient) {}
  
  // Add a Flight
  addFlight(flight: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, flight);
  }
  // Get the Flight
  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }
  
  // Search the Flight as Source and Destination
  searchFlights(
    source: string,
    destination: string,
    date: string
  ): Observable<any[]> {
    const requestBody = { source, destination, date };
    return this.http.post<any[]>(`${this.apiUrl}/search`, requestBody);
  }
  /** Update an existing flight */
  updateFlight(flight: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${flight.id}`, flight);
  }

  /** Delete a flight */
  deleteFlight(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/delete/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Delete Flight Error:', error);
          return throwError(() => new Error(error.message || 'Delete failed.'));
        })
      );
  }
  // Fetch the Source and Destination 
  getFlightLocations(): Observable<{ sources: string[], destinations: string[] }> {
    return this.http.get<{ sources: string[], destinations: string[] }>(`${this.apiUrl}/locations`);
  }
}
