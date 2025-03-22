import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
  
  // Using Logout Functionality
  logout() {
    this.authService.logout();
  }
 
  //Fetch the User Role
  getRole(): string | null {
    return this.authService.getUserRole();
  }
}
