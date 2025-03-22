import { Component } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searching',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searching.component.html',
  styleUrl: './searching.component.css'
})
export class SearchingComponent {
  flights: any[] = [];
  sources: string[] = [];
  destinations: string[] = [];
  selectedSource: string = '';
  selectedDestination: string = '';
  selectedDate: string = '';
  isFlightsAvailable: boolean = false;
  
  constructor(private flightService: FlightService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadLocations();
  }
 
  //Extract Source and Destination
  loadLocations(): void {
    this.flightService.getFlightLocations().subscribe({
      next: (data) => {
        this.sources = data.sources;
        this.destinations = data.destinations;
      },
      error: (err) => console.error('Error fetching locations:', err)
    });
  }
  
  extractUniqueLocations(): void {
    const sourcesSet = new Set(this.flights.map(flight => flight.source));
    const destinationsSet = new Set(this.flights.map(flight => flight.destination));
    
    this.sources = Array.from(sourcesSet);
    this.destinations = Array.from(destinationsSet);
  }
  
  // Search Flight
  searchFlights(): void {
    if (!this.selectedSource || !this.selectedDestination || !this.selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all fields before searching.',
      });
      return;
    }
    
    // Fetch flights based on selected criteria
    this.flightService.searchFlights(this.selectedSource, this.selectedDestination, this.selectedDate).subscribe({
      next: (data) => {
        this.flights = data;
        this.isFlightsAvailable = this.flights.length > 0;
        
        if (!this.isFlightsAvailable) {
          Swal.fire({
            icon: 'error',
            title: 'No Flights Available',
            text: `Sorry, no flights are available from ${this.selectedSource} to ${this.selectedDestination} on ${this.selectedDate}.`,
          });
        } else {
          setTimeout(() => {
            window.scrollTo({ top: window.scrollY + 300, behavior: 'smooth' });
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error searching flights:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while searching for flights. Please try again.',
        });
      }
    });
  }
  
  // Perform Book Flights
  bookFlight(flight: any): void {
    this.router.navigate(['/booking', flight.id]);
  }
}