import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { GetuserprofileComponent } from './components/getuserprofile/getuserprofile.component';
import { PostuserprofileComponent } from './components/postuserprofile/postuserprofile.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OldordersComponent } from './components/oldorders/oldorders.component';
import { ReviewComponent } from './components/review/review.component';

const routes: Routes = [
  { path: 'products', component: ProductComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: GetuserprofileComponent },
  { path: 'postuserprofile', component: PostuserprofileComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'oldorders', component: OldordersComponent },
  { path: 'reviews', component: ReviewComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
