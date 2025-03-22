import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { BookingService } from '../../services/booking.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SeatBookingComponent } from "../seat-booking/seat-booking.component";

@Component({
  selector: 'app-booking',
  standalone: true,  
  imports: [CommonModule, FormsModule, SeatBookingComponent],  
  providers: [FlightService, BookingService, AuthService], 
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  flightId!: number;
  flights: any;  
  bookingId!: number;

  // Passenger Details
  userId: number | null = null;
  userName: string | null = null;
  userEmail: string | undefined;
  userMobile: string | undefined;
  errorMessage: string | undefined;
  selectedSeat!: number;
  amount!: number;
  
  
  constructor(
    private route: ActivatedRoute,  
    private flightService: FlightService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router 
  ) {}
  
  ngOnInit(): void {
    const storedUserId = localStorage.getItem('id');
    const storedUserName = localStorage.getItem('name');

    if (storedUserId) {
      this.userId = Number(storedUserId);
      this.userName = storedUserName;
      this.fetchUserDetails();
    } else {
      this.errorMessage = 'User ID not found in local storage!';
    }
    this.fetchFlight();
    
  }
  
  //Fetching user Details
  fetchUserDetails() {
    if (this.userId !== null) {
      this.authService.getUserDetails(this.userId).subscribe({
        next: (data) => {
          this.userEmail = data.email;
          this.userMobile = data.phoneNumber;
        },
        error: () => {
          this.errorMessage = 'User not found!';
        }
      });
    }
  }
  
  //Fetch Flight Id
  fetchFlight(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.flightId = +params['id']; 
        return this.flightService.getFlights();
      })
    ).subscribe({
      next: (flights) => {
        const matchedFlight = flights.find(flight => flight.id === this.flightId);
        if (matchedFlight) {
          this.flights = matchedFlight;
        } else {
          Swal.fire('Error', 'Flight not found!', 'error');
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to load flight details.', 'error');
      }
    });
  }
  
  //Confirm Booking
  confirmBooking(): void {
    if (!this.flights) {
      Swal.fire('Error', 'No flight selected!', 'error');
      return;
    }

    if (!this.selectedSeat) {
      Swal.fire('Error', 'Please select a seat!', 'error');
      return;
    }

    const bookingData = {
      flightId: this.flights.id,
      userId: Number(this.userId),
      seatNumber: this.selectedSeat
    };

    this.bookingService.bookSeat(bookingData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success',
          text: response.message,
          icon: 'success',
          showCancelButton: true,  
          confirmButtonText: 'Proceed to Payment',
          cancelButtonText: 'Stay on this Page'
        }).then((result) => {
          if (result.isConfirmed) {
            if (response.bookingId !== null) {
              // Proceed with navigation if bookingId exists
              this.router.navigate([`/payment/${response.bookingId}`]);
            } else {
              console.log('No booking ID found');
            }
          }
        });
        
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Booking failed. Please try again.';
        
        if (error.error && error.error.error) {
          errorMessage = error.error.error; 
        }
    
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
  onSeatSelected(seatNumber: number) {
    this.selectedSeat = seatNumber;
    console.log('Selected Seat:', this.selectedSeat);
  }
}
