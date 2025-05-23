// Import des modules nécessaires à Angular, à la navigation, aux formulaires réactifs et aux validations
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Service d'authentification qui gère l'appel au backend
import { AuthService } from '../../../core/services/auth.service';

// Modèles représentant les données envoyées au backend (login) et reçues (response)
import { AuthLogin, AuthResponse } from '../../../core/models/auth';

import {NgClass, NgIf} from '@angular/common';

// Définition du composant Angular
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass], // Modules nécessaires au template
})
export class LoginComponent {
  // Déclaration des propriétés
  loginForm: FormGroup;         // Formulaire de login
  loading = false;              // Indique si une requête est en cours
  successMessage = '';          // Message affiché en cas de succès
  errorMessage = '';            // Message affiché en cas d'erreur

  // Constructeur qui injecte :
  // - FormBuilder : pour construire le formulaire réactif
  // - AuthService : pour interagir avec le backend
  // - Router : pour naviguer après connexion
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire avec deux champs : email et mot de passe
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // requis et format e-mail
      password: ['', Validators.required],  // requis
      remember : [false],
    });
  }

  // Méthode appelée à la soumission du formulaire
  onSubmit(): void {
    if (this.loginForm.invalid) return; // Si le formulaire est invalide, on arrête

    this.loading = true;      // Affichage d’un indicateur de chargement
    this.errorMessage = '';   // Réinitialisation des messages d’erreur

    const data: AuthLogin = this.loginForm.value; // Récupération des données du formulaire

    // Appel du service d’authentification
    this.authService.login(data).subscribe({
      next: (response: AuthResponse) => {
        const storage = data.remember ? localStorage : sessionStorage;
        // En cas de succès : sauvegarde du token et des infos dans le localStorage
        storage.setItem('token', response.token);
        storage.setItem('name', response.name);
        storage.setItem('email', response.email);
        storage.setItem('email_verified_at', response.email_verified_at || '');
        storage.setItem('id', response.id.toString());

        // Message de succès + redirection après 1,5 seconde
        this.successMessage = 'Connexion réussie. Redirection en cours...';
        setTimeout(() => {
          this.router.navigate(['/home_connected']);
        }, 1500);
      },
      error: (err) => {
        // En cas d’échec : on affiche un message d’erreur
        this.errorMessage = err.error?.message || 'Une erreur est survenue.';
        this.loading = false; // Arrêt de l’indicateur de chargement
      },
    });
  }
}
