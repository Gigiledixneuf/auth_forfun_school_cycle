import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import {GuestGuard} from './guards/guest.guard';
import {authGuard} from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path : '',
    title : 'Acceuil - School Cycle',
    loadComponent:() => import('../app/pages/home/home/home.component').then((m)=> m.HomeComponent),
  },
  {
    path : 'register',
    title : 'Inscription - School Cycle',
    canActivate: [GuestGuard],
    loadComponent:() => import('../app/pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path : 'login',
    title : 'Connexion - School Cycle',
    canActivate: [GuestGuard],
    loadComponent:() => import('../app/pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path : 'verify-email/:id/:hash',
    canActivate: [GuestGuard],
    title : 'Vérification - School Cycle',
    loadComponent : () =>
      import('./pages/auth/verify-email/verify-email.component').then((m)=> m.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    title : 'Mot de passe oublié - School Cycle',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'password-reset/:token',
    title : 'Nouveau mot de passe - School Cycle',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('../app/pages/auth/new-password/new-password.component').then((m) => m.NewPasswordComponent),
  },

  {
    path : 'create-announcement',
    title : 'Creation Annonce - School Cycle',
    loadComponent:() => import('../app/pages/announcement/create/create.component').then((m) => m.CreateComponent),
    canActivate : [authGuard]
  },
  {
    path : 'announcement/:id',
    title : 'Annonce - School Cycle',
    loadComponent : ()=> import('../app/pages/announcement/announcement-single/announcement-single.component').then((m)=> m.AnnouncementSingleComponent)
  },
  {
    path : 'annoncement-explorer',
    title : 'Explorer Annonce - School Cycle',
    loadComponent : ()=> import('../app/pages/announcement/announcement-explorer/announcement-explorer.component').then((m)=> m.AnnouncementExplorerComponent)
  },


  //pour une page non trouvé on sera redirigé ici
  {
    path : '404',
    title : '404 - School Cycle',
    loadComponent:()=> import('../app/pages/page-not-found/page-not-found.component').then((m)=> m.PageNotFoundComponent)
  },


  //pour toute les routes vides on soit rediriger vers l'acceuil
  {
    path : '',
    pathMatch : 'full',
    redirectTo : ''
  },

  //pour toute route generique non existante on sera rediriger dans la route 404
  {
    path : '**',
    redirectTo : '404'
  },



];
