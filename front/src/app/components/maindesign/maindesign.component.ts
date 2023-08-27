import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maindesign',
  templateUrl: './maindesign.component.html',
  styleUrls: ['./maindesign.component.css']
})
export class MaindesignComponent {
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
