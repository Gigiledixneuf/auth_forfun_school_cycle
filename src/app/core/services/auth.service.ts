// Importation des modules Angular nécessaires
import { HttpClient } from '@angular/common/http';   // Pour faire des requêtes HTTP
import { Injectable } from '@angular/core';          // Pour marquer la classe comme injectable

// Importation des modèles de données utilisés dans les appels d'authentification
import {
  AuthForgotPasswordData,
  AuthForgotPasswordResponse,
  AuthLogin, AuthPasswordResetData,         // Interface pour les données de login (email + mot de passe)
  AuthRegister,      // Interface pour les données d’inscription
  AuthResponse,      // Interface pour la réponse renvoyée après une connexion
} from '../models/auth';

import { Observable } from 'rxjs'; // Pour typer les retours asynchrones

// Ce service sera disponible dans toute l’application grâce à 'providedIn: root'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL de base de l’API Laravel locale. À modifier pour l’environnement de production.
  private url = "http://127.0.0.1:8000/api/";

  // Injection de HttpClient pour faire des requêtes HTTP
  constructor(private http: HttpClient) { }

  /**
   * Envoie des données d'inscription à l'API pour créer un nouvel utilisateur.
   * @param data Les informations d’inscription (nom, email, mot de passe, etc.)
   */
  register(data: AuthRegister) {
    return this.http.post(this.url + 'register', data);
  }

  /**
   * Envoie les informations de connexion à l’API et attend une réponse typée AuthResponse.
   * @param data Les informations de connexion (email + mot de passe)
   * @returns Observable<AuthResponse> contenant le token, nom, email, etc.
   */
  login(data: AuthLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url + 'login', data);
  }

  /**
   * Envoie l'email pour le changement de mot de passe à l’API et attend une réponse typée AuthForgotPasswordResponse.
   * @param data L'information pour le changement de mot de passe (email)
   * @returns Observable<AuthForgotPasswordResponse> contenant le status de la requette.
   */
  forgotPassword(data: AuthForgotPasswordData): Observable<AuthForgotPasswordResponse> {
    return this.http.post<AuthForgotPasswordResponse>(this.url + 'forgot-password', data);
  }

  /**
   * Recupère l'email dans l'url swordResponse.
   * @param data L'information pour le changement de mot de passe (email)
   * @returns Observable<AuthForgotPasswordResponse> contenant le status de la requette.
   */
  resetPassword(data : AuthPasswordResetData){
    return this.http.post(this.url + 'reset-password' , data );
  }



}
