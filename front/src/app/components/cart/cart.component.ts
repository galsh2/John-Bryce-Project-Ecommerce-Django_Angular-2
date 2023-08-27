import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService) { }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const product of this.cart) {
      totalPrice += product.price * product.quantity;
    }

    return totalPrice;
  }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();

    this.cartService.cartObservable.subscribe(updatedCart => {
      this.cart = updatedCart;
    });
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  incrementQuantity(index: number): void {
    this.cartService.incrementQuantity(index);
  }

  decrementQuantity(index: number): void {
    this.cartService.decrementQuantity(index);
  }
}
