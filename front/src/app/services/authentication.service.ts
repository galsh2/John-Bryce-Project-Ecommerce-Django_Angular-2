import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartService } from './cart.service';

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/';
  private loginUrl = 'http://localhost:8000/app/token/';
  private logoutUrl = 'http://localhost:8000/app/token/blacklist/';
  private tokenKey = 'access_token';
  private token: string = '';
  onUserLoggedIn = new EventEmitter<boolean>();

  checkUserLoggedIn(): void {
    const isLoggedIn = this.isLoggedIn();
    this.onUserLoggedIn.emit(isLoggedIn);
  }

  constructor(private http: HttpClient, private cartService: CartService) { }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem(this.tokenKey);

    if (accessToken) {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        const tokenExpirationDate = new Date(decodedToken.exp * 1000);
        const currentDate = new Date();
        return tokenExpirationDate > currentDate;
      }
    }

    return false;
  }


  register(username: string, email: string, password: string): Observable<any> {
    const registrationData = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(`${this.apiUrl}app/register/`, registrationData);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('access_token', response.access);

        // Try to load cart from DB to local storage
        try {
          this.cartService.loadFromDB();
        } catch (error) {
          // If an error occurs when loading, save the cart to the DB
          this.cartService.saveCart();
        }

        // Emit the event to indicate that the user is logged in
        this.onUserLoggedIn.emit(true);
      })
    );
  }


  logout(refreshToken: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

    return this.http.post(this.logoutUrl, { refresh_token: refreshToken }, httpOptions);
  }

  getToken() {
    return this.token;
  }
}


