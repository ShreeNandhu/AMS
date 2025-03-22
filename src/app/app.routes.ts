import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchingComponent } from './components/searching/searching.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FlightMgmComponent } from './components/flight-mgm/flight-mgm.component';
import { BookingComponent } from './components/booking/booking.component';
import { PaymentComponent } from './components/payment/payment.component';
import { BookingListComponent } from './components/booking-list/booking-list.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  // User Routes
  { path: '', component: HomeComponent},
  { path: 'search-flights', component: SearchingComponent },
  { path: 'booking-history', component: BookingHistoryComponent  },
  { path: 'booking/:id', component: BookingComponent },
  { path: 'payment/:bookingId', component: PaymentComponent},
  { path: 'profile', component: ProfileComponent},

  //Admin Routes
  { path: 'manage-flights', component: FlightMgmComponent },
  { path: 'bookingList', component: BookingListComponent  },
  
  //Auth Routes
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
