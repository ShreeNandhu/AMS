import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[FormsModule,CommonModule,FontAwesomeModule,RouterModule]
})
export class LoginComponent {
  user = { email: '', password: '' };
  showPassword = false;
 
  showForgotPasswordModal = false;
  errorMessage = '';
  
  userId: number = 1; // Assume user ID is retrieved from authentication service
  newPassword: string = '';
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // Toggle Password Visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Login Functionality
  login() {
    if (!this.user.email || !this.user.password) {
      this.showError('Please enter email and password');
      return;
    }

    this.authService.login(this.user.email, this.user.password).subscribe(
      (response) => {
        if (response.message === 'Login successful') {
          this.authService.saveUserData(response.name, response.role, response.id);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome, ${response.name}!`,
          }).then(() => {
            this.router.navigate(['/']);
          });
        } else {
          this.showError(response.message);
        }
      },
      () => {
        this.showError('Invalid credentials');
      }
    );
  }

  showError(message: string) {
    this.errorMessage = message;
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: message,
    });
  }

}
