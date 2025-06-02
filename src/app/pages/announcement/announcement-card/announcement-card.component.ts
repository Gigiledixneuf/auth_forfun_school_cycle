import { AnnouncementService } from './../../../core/services/announcement/announcement.service';
import { Component, Input } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement-card',
  imports: [  CommonModule],
  templateUrl: './announcement-card.component.html',
  styleUrl: './announcement-card.component.css'
})
export class AnnouncementCardComponent {

  announcementId! : number;
  constructor(private announcementService :  AnnouncementService){}
  @Input () announcement! : Announcement
  ngOnInit() {
    console.log('Image principale :', this.announcement?.photos?.[0]?.url);
  }


  addTofavorite() {
    this.announcementService.addTofavorite(this.announcement.id).subscribe({
      next: (response) => {
        const token = localStorage.getItem('token')
        console.log('Réponse complète :', response, token);
        // Optionnel : feedback visuel ou changement d'icône
      },
      error: (err) => {
        const token = localStorage.getItem('token')
        console.log(token);
        
        console.error("Erreur ajout favori :", err);
      }
    });
  }
  
}
