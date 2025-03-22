import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [FormsModule, CommonModule],
})
export class PaymentComponent {
  bookingId!: number;
  paymentMethod: string = 'Credit Card';
  amount: number = 0;
  flightAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.bookingId = Number(params.get('bookingId')) || 0;
      if (this.bookingId) {
        this.fetchFlightAmount(this.bookingId);
      }
    });
  }

  fetchFlightAmount(bookingId: number) {
    this.bookingService.getBookingById(bookingId).subscribe(
      (booking) => {
        if (booking && booking.flight) {
          this.flightAmount = booking.flight.price ?? 0; // ✅ Ensure it's always a number
          this.amount = this.flightAmount; // ✅ Assign the value correctly
        } else {
          console.error('Booking not found or missing flight details');
          this.flightAmount = 0; // ✅ Default to 0 if no flight details
          this.amount = 0;
        }
      },
      (error) => {
        console.error('Error fetching booking:', error);
        this.flightAmount = 0; // ✅ Handle error case
        this.amount = 0;
      }
    );
  }

  // Payment Functionality
  processPayment() {
    if (!this.bookingId || this.amount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please enter a valid Booking ID and amount!',
      });
      return;
    }

    this.bookingService.processPayment(this.bookingId, this.paymentMethod, this.amount).subscribe(
      (response: any) => {
        if (response.message) {
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: 'The Payment was Successfully Completed',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']); // Navigate to home page
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Unexpected response format.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Something went wrong! Please try again.',
        });
        console.error(error);
      }
    );
  }
}
