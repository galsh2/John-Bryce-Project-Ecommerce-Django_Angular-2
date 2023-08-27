import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maindesigntwo',
  templateUrl: './maindesigntwo.component.html',
  styleUrls: ['./maindesigntwo.component.css']
})
export class MaindesigntwoComponent {
  showLogin: boolean = false;
  showRegister: boolean = false;
  showProduct: boolean = true;

  constructor(private router: Router) {} // Inject the Router into the constructor

  // goToLogin() {
  //   this.router.navigate(['/login']); // Navigate to the 'login' route
  // }
  // goToRegister() {
  //   this.router.navigate(['/register']); // Navigate to the 'login' route
  // }
  goToLogin() {
    this.showLogin = true;
    this.showRegister = false;
    this.showProduct = false;
  }

  goToRegister() {
    this.showLogin = false;
    this.showRegister = true;
    this.showProduct = false;
  }
  goToProduct() {
    this.showLogin = false;
    this.showRegister = false;
    this.showProduct = true;
  }
}
