import { AnnouncementService } from './../../../core/services/announcement/announcement.service';
import {Component, inject, Input} from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-announcement-card',
  imports: [  CommonModule, RouterLink],
  templateUrl: './announcement-card.component.html',
  styleUrl: './announcement-card.component.css'
})
export class AnnouncementCardComponent {


  announcementId! : number;
  private router = inject(Router)
  errorMessage : string = '';
  successMessage : string = ''
  storageUrl = environment.storageUrl;

  constructor(private announcementService :  AnnouncementService){}
  @Input () announcement! : Announcement
  isConnected: boolean = false;
  token : string = '';
  ngOnInit() {
    this.isConnectedMethode();
    console.log('Image principale :', this.announcement?.photos?.[0]?.url);
  }


  isConnectedMethode() {
    const token = localStorage.getItem('token');

    if (token) {
      this.isConnected = true;
      this.token = token;
    }
  }
  addTofavorite() {
    const token = localStorage.getItem('token');
    if (token) {
      this.announcementService.addTofavorite(this.announcement.id).subscribe({
        next: (response: any) => {
          this.successMessage = response.message;
          setTimeout(()=>{
            this.successMessage = '';
          }, 1500);
          console.log('Réponse complète :', response);
        },
        error: (err) => {
          this.errorMessage = err.error?.erreur || err.error?.message || 'Une erreur est survenue';
          console.error("Erreur ajout favori :", err);
        }
      });
    } else {
      this.errorMessage = 'connectez-vous pour ajouter en favoris';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    }
  }


}
