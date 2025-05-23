import { HomeConnectedComponent } from './pages/home/home-connected/home-connected.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { Routes } from '@angular/router';
export const routes: Routes = [
  //====================== START AUTH PATHS ========================
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path : 'verify-email/:id/:hash',
    loadComponent : ()=>
      import('./pages/auth/verify-email/verify-email.component').then((m)=> m.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'password-reset/:token',
    loadComponent: () =>
      import('../app/pages/auth/new-password/new-password.component').then(
        (m) => m.NewPasswordComponent
      ),
  },
  {
    path : 'home_connected',
    loadComponent: () =>
      import('./pages/home/home-connected/home-connected.component').then(
        (m) => m.HomeConnectedComponent
      ),
  },

  //====================== END AUTH PATHS ============================
];
