import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Review {
  id: number;
  product: number;
  rating: number;
  content: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})

export class ReviewService {

  private apiUrl = 'http://localhost:8000/app/reviews/';
  
  constructor(private http: HttpClient) { }

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getReviewOrders(): Observable<any> {
    const endpoint = `${this.apiUrl}`; 
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      throw new Error('Token not found in local storage.');
    }
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(endpoint, { headers: headers });
  }


  createReview(review: any): Observable<any> {
    const endpoint = `${this.apiUrl}`;
    // Fetch the token from local storage
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      throw new Error('Token not found in local storage.');
    }
    // Set the token in the headers
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    // return this.http.post(endpoint, { cart_items: cartItems, order_id: orderID }, { headers: headers });
    return this.http.post(endpoint, review, { headers: headers });
    // return this.http.post(endpoint, {  review: review }, { headers: headers });
  }

  updateReview(id: number, review: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

