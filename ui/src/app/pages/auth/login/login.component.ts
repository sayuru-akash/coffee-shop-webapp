import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private http: HttpClient) {}

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
    console.log(form.value);
    const user = {
      email: form.value.email,
      password: form.value.password,
    };

    this.http.post('http://localhost:3000/api/user/login', user).subscribe(
      (response: any) => {
        this.successMessage = response['msg']; // Set the success message
        this.errorMessage = ''; // Clear any previous error message
        form.reset(); // Reset the form

        const now = new Date();
        const item = {
          id: response['id'],
          expiration: now.getTime() + 3600000,
        };
        localStorage.setItem('loginToken', JSON.stringify(item));

        // after a delay, redirect to home page
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.msg || 'Invalid Credentials'; // Set the error message
        this.successMessage = ''; // Clear any previous success message
      }
    );
  }
}
