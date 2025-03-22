import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-flight-mgm',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './flight-mgm.component.html',
  styleUrls: ['./flight-mgm.component.css'],
})
export class FlightMgmComponent implements OnInit {
  fetchflights: any[] = [];
  availableSeats: number[] = [];
  flightId: number | null = null; // Ensure flightId is declared

  flight = {
    airline: '',
    source: '',
    destination: '',
    arrivalTime: '',
    departureTime: '',
    price: 0,
    totalSeats: 0,
  };

  showModal = false;
  selectedFlight: any = {};
  selectedIndex: number = -1;

  constructor(
    private flightService: FlightService,
    private bookingService: BookingService // Ensure bookingService is injected
  ) {}

  ngOnInit(): void {
    this.fetchFlights();
  }

  /** Opens the modal with selected flight data */
  openModal(flight: any, index: number) {
    this.selectedFlight = { ...flight };
    this.selectedIndex = index;
    this.showModal = true;
  }

  /** Closes the modal */
  closeModal() {
    this.showModal = false;
    this.selectedFlight = {};
    this.selectedIndex = -1;
  }

  /** Adds a new flight */
  submitFlight() {
    this.flightService.addFlight(this.flight).subscribe({
      next: (response) => {
        this.fetchflights.push(response);

        Swal.fire({
          title: 'Success!',
          text: 'Flight added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding flight:', error);

        Swal.fire({
          title: 'Error!',
          text: 'Failed to add flight. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  /** Fetches all flights and available seats */
  fetchFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.fetchflights = flights;

        if (flights.length > 0) {
          this.flightId = flights[0].id;
          this.fetchAvailableSeats(this.flightId);
        }
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
      },
    });
  }

  /** Fetches available seats for the selected flight */
  fetchAvailableSeats(flightId: number): void {
    this.bookingService.getAvailableSeats(flightId).subscribe({
      next: (seats) => {
        this.availableSeats = seats;
      },
      error: (error) => {
        console.error('Error fetching available seats:', error);
      },
    });
  }

  /** Updates flight details */
  updateFlight() {
    if (this.selectedIndex !== -1) {
      const updatedFlight = { ...this.selectedFlight };

      this.flightService.updateFlight(updatedFlight).subscribe({
        next: (response) => {
          this.fetchflights[this.selectedIndex] = response;

          Swal.fire({
            title: 'Updated!',
            text: 'Flight details updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating flight:', error);

          Swal.fire({
            title: 'Error!',
            text: 'Failed to update flight details.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }

  /** Resets the flight form */
  resetForm() {
    this.flight = {
      airline: '',
      source: '',
      destination: '',
      arrivalTime: '',
      departureTime: '',
      price: 0,
      totalSeats: 0,
    };
  }

  /** Deletes a flight */
  deleteFlight(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This flight will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.flightService.deleteFlight(id).subscribe({
          next: () => {
            this.fetchflights = this.fetchflights.filter((flight) => flight.id !== id);
            Swal.fire('Deleted!', 'This Flight was Removed Successfully .All Associative Bookings have been Cancelled & SMS Send to Passengers', 'success');
          },
          error: (error) => {
            console.error('Error deleting flight:', error);
            Swal.fire('Error!', 'Failed to delete flight.', 'error');
          },
        });
      }
    });
  }
}
