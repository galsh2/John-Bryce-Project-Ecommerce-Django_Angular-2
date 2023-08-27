import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: any[] = [];
  cartObservable = new Subject<any[]>();
  apiUrl = 'http://localhost:8000/';
  pic: any;

  constructor(private http: HttpClient) { }

  addToCart(product: any): void {
    // console.log(product);
    this.pic = product.product_picture
    let productInCart = this.cart.find(item => item.id === product.id);
    if (productInCart) {
      productInCart.quantity += 1;
      productInCart.totalPrice = productInCart.quantity * productInCart.price;
      productInCart.product_picture = product.product_picture
    } else {
      product.quantity = 1;
      product.totalPrice = product.quantity * product.price;
      this.cart.push({ id: product.id, name: product.name, price: product.price, quantity: product.quantity, totalPrice: product.totalPrice, img: product.product_picture });
    }
    this.saveCart();
  }

  getCart(): any[] {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return this.cart;
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  incrementQuantity(index: number): void {
    this.cart[index].quantity++;
    this.saveCart();
  }

  decrementQuantity(index: number): void {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
      this.saveCart();
    }
  }

  public loadFromDB(): void {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    this.http.get('http://localhost:8000/app/get-cart/', { headers: headers })
      .subscribe(
        (response: any) => {
          // Assuming the backend returns the cart data in the response
          const loadedCart = response;
          // Update the local cart object
          this.cart = loadedCart;
          // console.log(this.cart);
          localStorage.setItem('cart', JSON.stringify(this.cart));
          // Notify observers about the updated cart
          this.cartObservable.next(this.cart);

          console.log('Cart loaded from DB', this.cart);
        },
        error => {
          console.log('3');
          console.error('Error loading cart from DB', error);
        }
      );
  }

  public saveCart(): void {
    // Check if 'cart' exists in local storage
    localStorage.setItem('cart', JSON.stringify(this.cart));
    // this.loadCartFromDB()
    this.cartObservable.next(this.cart);

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    this.http.post('http://localhost:8000/app/save-cart/', this.cart, { headers: headers })
      .subscribe(
        response => {
          console.log(response);

          console.log('Cart saved successfully', response);
        },
        error => {
          console.error('Error saving cart in DB', error);
        }
      );
  }
}
