
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';
import { UserprofileService } from 'src/app/services/userprofile.service';

declare global {
  interface Window {
    paypal?: any;
  }
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {

  paymentId!: string;
  // orderId: string | null = null;
  orderId!: string

  constructor(public authService: AuthService, private userProfileService: UserprofileService, private router: Router, private orderService: OrderService) { } // Inject the AuthService

  cartItems = this.getCartItemsFromLocalStorage();

  ngOnInit() {
    this.calculateGrandTotal();
    if (this.authService.isLoggedIn()) { // Check if user is logged in
      // console.log('1');
      this.checkUserProfileExists();

    }
  }

  getCartItemsFromLocalStorage(): any {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  generateOrder(payment: any) {
    this.orderService.generateOrder(payment).subscribe(
      response => {

        console.log('Order generated with ID:', response.order_id);
        alert('Order generated successfully! your order id is: ' + response.order_id);

      },
      error => {
        console.error('Error generating order:', error);
        alert('Failed to generate order.');
      }
    );
  }


  checkUserProfileExists() {
    this.userProfileService.getUserProfile().subscribe(
      data => {
        if (data && data.length > 0) {  // Check if user profile exists
          this.initPaypalButton();
        } else {
          // No user profile found, redirect to '/postuserprofile'
          this.router.navigateByUrl('/postuserprofile');
        }
      },
      error => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  grandTotal: number = 0; // Declare it here as a class property


  calculateGrandTotal() {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];

    this.grandTotal = 0; // Reset it to 0 before calculating

    for (const item of cartItems) {
      const itemTotal = item.quantity * parseFloat(item.price);
      this.grandTotal += itemTotal;
    }

    console.log('Grand Total:', this.grandTotal);
  }

  initPaypalButton() {
    if (!window.paypal) {
      console.error('Paypal SDK not loaded.');
      return;
    }

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.grandTotal.toFixed(2) // Use the class property here
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.paymentId = details.id;  // Save Payment ID
          console.log('Order approved:', details);
          // console.log("Payment ID:", details.id);
          this.generateOrder(details.id);

          localStorage.removeItem('cart');
        });
      },
      onError: (err: any) => {
        console.error('Payment error:', err);
      }
    }).render('#paypal-button-container');
  }
}




