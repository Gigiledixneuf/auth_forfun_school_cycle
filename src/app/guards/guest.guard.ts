import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // Rediriger vers l'accueil ou dashboard si déjà connecté
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
