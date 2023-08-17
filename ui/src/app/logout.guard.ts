import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    localStorage.removeItem('loginToken'); // Remove the token from local storage
    this.router.navigate(['/login']); // Navigate to the login page
    return false; // Prevent navigation to the /logout route
  }
}
