import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  userId: string = '';

  canActivate(): boolean {
    if (localStorage.getItem('loginToken')) {
      const loginToken: any = localStorage.getItem('loginToken');
      const item = JSON.parse(loginToken);
      const now = new Date();
      if (now.getTime() < item.expiration) {
        this.userId = item.id;
      }
      if (this.userId === '64dd153a8046e9bb85312265') {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
