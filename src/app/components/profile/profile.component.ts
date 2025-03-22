import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[FormsModule,CommonModule,FontAwesomeModule]
})
export class ProfileComponent implements OnInit {
  user = { name: '', email: '', phoneNumber: '' };
  userName: string = '';

  newEmail = '';
  newPassword = '';
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  showEmailModal = false;
  showPasswordModal = false;

  constructor(private http: HttpClient,private authService : AuthService,private profileService: ProfileService) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.userName = this.authService.getUserName() || ''; // Get username from AuthService
    const userId = this.authService.getId(); // Get user ID from AuthService
  
    if (!userId) {
      console.warn("User ID not found in local storage");
      return;
    }
  
    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      console.warn("Invalid user ID in local storage");
      return;
    }
  
    this.authService.getUserDetails(userIdNumber).subscribe(
      (res: any) => {
        if (res) {
          this.user = res;
        } else {
          console.warn("User details returned empty.");
        }
      },
      (error: HttpErrorResponse) => {
        console.error("Error fetching user details:", error.error?.message || error.message);
      }
    );
  }

  showPassword = false;

  openUpdateEmailModal() {
    this.showEmailModal = true;
  }

  closeModals() {
    this.showEmailModal = false;
    this.showPasswordModal = false;
  }
  openUpdatePasswordModal() {
    this.showPasswordModal = true;
  }


  updateEmail() {
    if (!this.newEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
      });
      return;
    }
  
    this.profileService.updateUserEmail(this.user.email, this.newEmail)
      .subscribe({
        next: (response: { message: string }) => {  // ✅ Explicitly define response type
          Swal.fire({
            icon: 'success',
            title: 'Email Updated',
            text: response.message,  // ✅ Ensure response.message is defined
          });
          this.user.email = this.newEmail; // ✅ Update UI
          this.closeModals();
        },
        error: (error: any) => {  // ✅ Ensure error is handled correctly
          console.error('Error updating email:', error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error?.error?.message || 'Failed to update email. Please try again.',  // ✅ Handle error safely
          });
        }
      });
  };
  

  deleteAccount() {
    const userId = this.authService.getId(); // ✅ Get user ID correctly
  
    if (!userId) {  // ✅ Use 'userId' instead of 'this.userId'
      Swal.fire({
        icon: 'warning',
        title: 'Invalid User',
        text: 'User ID is missing. Please try again.',
      });
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action is irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete my account'
    }).then((result) => {
      if (result.isConfirmed) {
        this.profileService.deleteUser(userId).subscribe({  // ✅ Use 'userId' here
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Account Deleted',
              text: 'Your account has been deleted successfully.',
            }).then(() => {
              this.authService.logout(); // ✅ Clear session/logout user
            });
          },
          error: (error) => {
            console.error('Error deleting account:', error);
            Swal.fire({
              icon: 'error',
              title: 'Deletion Failed',
              text: error.error?.message || 'Failed to delete account. Please try again.',
            });
          }
        });
      }
    });
  }
   // Toggle Password Visibility
   togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  updatePassword() {
    const userId: number = Number(this.authService.getId());
    if (!this.newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Password',
        text: 'Please enter a new password.',
      });
      return;
    }

    this.profileService.changePassword(userId, this.newPassword).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: 'Your password has been changed successfully.',
        });
        this.newPassword = ''; // Reset field after success
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error?.error?.message || 'An error occurred. Please try again.',
        });
      }
    );
  }
  
  logout() {
    this.authService.logout();
  }
}
