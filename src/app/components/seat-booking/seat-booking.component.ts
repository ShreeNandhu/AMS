import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seat-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seat-booking.component.html',
  styleUrl: './seat-booking.component.css',
})
export class SeatBookingComponent {
  @Input() availableSeats: number | null = null;
  @Input() bookedSeats: number[] = [];
  @Output() seatSelected = new EventEmitter<number>();

  seats: { id: number; label: string; isBooked: boolean }[] = [];
  seatPartitions: { id: number; label: string; isBooked: boolean }[][] = [];
  selectedSeat: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableSeats'] || changes['bookedSeats']) {
      this.generateSeats();
    }
  }

  generateSeats() {
    if (this.availableSeats === null) return;

    this.seats = Array.from({ length: this.availableSeats }, (_, index) => ({
      id: index,
      label: `${index}`,
      isBooked: this.bookedSeats.includes(index), // Mark booked seats
    }));

    this.partitionSeats();
  }

  partitionSeats() {
    this.seatPartitions = [];
    const partitionSize = 20; 

    for (let i = 0; i < this.seats.length; i += partitionSize) {
      this.seatPartitions.push(this.seats.slice(i, i + partitionSize));
    }
  }

  selectSeat(seatId: number) {
    const selectedSeat = this.seats.find(seat => seat.id === seatId);
    if (selectedSeat?.isBooked) return; // Prevent selecting booked seat

    this.selectedSeat = seatId;
    this.seatSelected.emit(seatId); // Send selected seat back to BookingComponent
  }
}
