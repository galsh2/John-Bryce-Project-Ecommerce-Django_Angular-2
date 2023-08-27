import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8000/app';

  constructor(private http: HttpClient) { }

  getUserOrders(): Observable<any> {
    const endpoint = `${this.apiUrl}/get-order/`; // Replace with the actual endpoint
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      throw new Error('Token not found in local storage.');
    }
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(endpoint, { headers: headers });
  }

  // generateOrder(cartItems: any,orderID: string): Observable<any> {
  generateOrder(paymentID: any): Observable<any> {
    const endpoint = `${this.apiUrl}/save-order/`;

    // Fetch the token from local storage
    const token = localStorage.getItem('access_token'); 

    if (!token) {
      throw new Error('Token not found in local storage.');
    }

    // Set the token in the headers
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    // return this.http.post(endpoint, { cart_items: cartItems, order_id: orderID }, { headers: headers });
    return this.http.post(endpoint, {  payment_id: paymentID }, { headers: headers });

  }

}  