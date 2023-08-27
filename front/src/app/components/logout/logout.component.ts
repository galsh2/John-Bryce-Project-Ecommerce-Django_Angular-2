
import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service'; // Please adjust the path according to your folder structure

@Component({
  selector: 'app-logout',

  template: '<button (click)="logout()" type="button" class="btn btn-light">Logout</button>'
})

export class LogoutComponent {

  constructor(private authService: AuthService) { }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    // console.log('1');

    if (refreshToken) {
      // console.log('2');
      this.authService.logout(refreshToken).subscribe(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('cart');
        console.log('user logged out');
        window.location.reload();
      });
    } else {
      console.error('Refresh token not found');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      localStorage.removeItem('cart');
      // console.log('1');
      window.location.reload();
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    localStorage.clear();
    window.location.reload();
  }
}



