import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BookingService } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-history',
  imports: [FormsModule, CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css',
})
export class BookingHistoryComponent {
  bookings: any[] = []; // This will hold the booking data

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    this.getBookings();
  }

  // Get Booking Data
  getBookings() {
    this.bookingService.getUserBookings().subscribe((data: any[]) => {
      this.bookings = data;
    });
  }

  // Cancel Booking Data
  cancelBooking(bookingId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.cancelBooking(bookingId).subscribe(
          (response) => {
            // Remove the cancelled booking from the list
            this.bookings = this.bookings.filter(
              (booking) => booking.id !== bookingId
            );
            Swal.fire('Deleted!', 'The booking has been deleted.', 'success');
          },
          (error) => {
            console.error('Error canceling booking', error);
            Swal.fire(
              'Error!',
              'There was an error canceling the booking.',
              'error'
            );
          }
        );
      }
    });
  }

  // Confirm Booking
  confirmBooking(booking: any): void {
    if (!booking || !booking.id) {
      Swal.fire('Error', 'Invalid booking data!', 'error');
      return;
    }

    this.router.navigate([`/payment/${booking.id}`]);
  }
}
