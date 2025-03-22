import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, FontAwesomeModule],
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', address: '', phoneNumber: '' };
  Password = '';
  showPassword = false;
  showConfirmPassword = false;

  errors: any = {};

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private authService: AuthService, private router: Router) {}
  
  //Password Visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Confirm password Visibility
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  get passwordMismatch() {
    return this.user.password !== this.Password && this.Password.length > 0;
  }
  
  //Register User Function
  registerUser() {
    if (this.passwordMismatch) {
      this.errors.password = 'Passwords do not match';
      return;
    }
    this.authService.register(this.user).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Registered successfully!', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 400 && error.error) {
          // Check if the response contains validation errors
          if (typeof error.error === 'object') {
            const errorMessages = Object.values(error.error).join('<br>');

            Swal.fire({
              icon: 'error',
              title: 'Validation Errors',
              html: errorMessages,
            });
          } else {
            Swal.fire('Error', error.error || 'Validation failed', 'error');
          }
        } else {
          Swal.fire('Error', 'Something went wrong!', 'error');
        }
      },
    });
  }
}
