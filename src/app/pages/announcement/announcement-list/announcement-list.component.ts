import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../announcement-card/announcement-card.component';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-announcement-list',
  imports: [AnnouncementCardComponent, NgFor],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.css'
})
export class AnnouncementListComponent {

  announcements!: Announcement[];
  constructor(private announcementService: AnnouncementService) { }

  ngOnInit() {
    this.getAnnoucements();
  }


  // Récupère les annonces depuis l'API
  getAnnoucements() {
    this.announcementService.getAnnouncements().subscribe({
      next: (res) => {
        this.announcements = res.data; // Stocke les annonces
        console.log('Annonces:', this.announcements); // Debug
      },
    });
  }
}
