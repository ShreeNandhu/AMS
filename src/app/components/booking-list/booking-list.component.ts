import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service'; // Adjust the path if needed
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
  imports:[FormsModule,CommonModule]
})
export class BookingListComponent implements OnInit {
  bookings: any[] = []; // This will hold the booking data

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.getBookings();
  }
  
  //Fetch all the Bookings For Admin
  getBookings() {
    this.bookingService.getAllBookings().subscribe((data: any[]) => {
      this.bookings = data;
    });
  }
  
  //Cancel Booking By Admin
  cancelBooking(bookingId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.cancelBooking(bookingId).subscribe(
          (response) => {
            // Remove the cancelled booking from the list
            this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
            Swal.fire(
              'Deleted!',
              'The booking has been deleted.',
              'success'
            );
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
}
