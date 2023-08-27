import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GetuserprofileComponent } from './components/getuserprofile/getuserprofile.component';
import { PostuserprofileComponent } from './components/postuserprofile/postuserprofile.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OldordersComponent } from './components/oldorders/oldorders.component';
import { MaindesignComponent } from './components/maindesign/maindesign.component';
import { MaindesigntwoComponent } from './components/maindesigntwo/maindesigntwo.component';
import { MainComponent } from './components/main/main.component';
import { ReviewComponent } from './components/review/review.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    CartComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    NavbarComponent,
    GetuserprofileComponent,
    PostuserprofileComponent,
    PaymentComponent,
    OldordersComponent,
    MaindesignComponent,
    MaindesigntwoComponent,
    MainComponent,
    ReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
