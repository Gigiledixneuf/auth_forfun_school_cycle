import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../announcement-card/announcement-card.component';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {PaginationMeta, PaginationUrls} from '../../../core/models/announcement/pagination';


@Component({
  selector: 'app-announcement-list',
  imports: [AnnouncementCardComponent, NgFor, NgClass, NgIf],
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
  getAnnoucements(page : number = 1) {
    this.announcementService.getAnnouncements(page).subscribe({
      next: (res) => {
        this.announcements = res.data;
        console.log('Annonces:', this.announcements);
      },
      error:(err) => {
        console.error("Erreur lors du chargement des annonces :", err);
      }
    });
  }


}
