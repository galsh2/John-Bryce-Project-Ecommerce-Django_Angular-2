import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registertwo',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  emailExistsError = false;

  constructor(private http: HttpClient) {}

  registerUser() {
    this.emailExistsError = false;

    // Send a POST request to the Django API endpoint
    this.http.post('http://localhost:8000/app/register/', this.user).subscribe(
      (response: any) => {
        // Registration successful
        console.log(response.message);
        // Reset the form
        this.user = {
          username: '',
          email: '',
          password: ''
        };
      },
      (error: any) => {
        // Registration error
        if (error.error && error.error.error === 'Email already exists.') {
          this.emailExistsError = true;
        }
        console.log(error);
      }
    );
  }
}



