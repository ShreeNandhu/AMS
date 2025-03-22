import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string = 'Guest';
  
  constructor(private router: Router,public authService: AuthService) {}
  ngOnInit(): void {
    this.username = localStorage.getItem('name') || 'Guest';
  }
  //Navigation to Search
  navigateToSearch() {
    this.router.navigate(['/search-flights']);
  }

  //Get the Role
  getRole(): string | null {
    return this.authService.getUserRole();
  }
}
