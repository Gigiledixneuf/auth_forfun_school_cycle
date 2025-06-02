import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthForgotPasswordData, AuthForgotPasswordResponse, AuthLoginData, AuthLoginResponse, AuthPasswordResetData, AuthRegisterData} from '../../models/auth/auth';
import {environment} from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiUrl;

  constructor(private http : HttpClient, private router : Router) { }

  //methode pour la protection en guard des routes
  isLoggIn = () => {
    const token = localStorage.getItem('token')
    if (token) {
      return true
    }else{
      this.router.navigate(['/']);
      return false
    }
  }

  /**
   * Envoie les informations de connexion à l’API et attend une réponse typée AuthLoginResponse.
   * @param data Les informations de connexion (email + mot de passe)
   * @returns Observable<AuthLoginResponse> contenant le token, nom, email, etc.
   */
  login(data: AuthLoginData): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(this.url + 'login', data);
  }

  /**
   * Envoie des données d'inscription à l'API pour créer un nouvel utilisateur.
   * @param data Les informations d’inscription (nom, email, mot de passe, etc.)
   */
  register(data: AuthRegisterData) {
    return this.http.post(this.url + 'register', data);
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
