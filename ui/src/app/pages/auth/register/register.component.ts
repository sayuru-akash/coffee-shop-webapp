import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  constructor(private http: HttpClient) {}

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  loggedIn: boolean = false;
  loggedInUser: any = {};

  ngOnInit(): void {
    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      const now = new Date();
      const item = JSON.parse(loginToken);
      if (now.getTime() < item.expiration) {
        this.loggedIn = true;
      }
    }
  }

  onSubmit(form: NgForm) {
    const user = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
    };
    this.http.post('http://localhost:3000/api/user/register', user).subscribe(
      (response: any) => {
        this.successMessage = response['msg']; // Set the success message
        this.errorMessage = ''; // Clear any previous error message
        form.reset(); // Reset the form
      },
      (error) => {
        this.errorMessage = error.error.msg || 'User already exists or invalid form'; // Set the error message
        this.successMessage = ''; // Clear any previous success message
      }
    );
  }
}
