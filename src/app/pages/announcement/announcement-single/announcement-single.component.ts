import { Component } from '@angular/core';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {HeaderComponent} from '../../../components/shared/header/header.component';
import {FooterComponent} from '../../../components/shared/footer/footer.component';
import {AnnouncementCardComponent} from '../announcement-card/announcement-card.component';

@Component({
  selector: 'app-announcement-single',
  imports: [NgFor, NgIf, RouterLink, CommonModule, HeaderComponent, FooterComponent, AnnouncementCardComponent],
  templateUrl: './announcement-single.component.html',
  styleUrl: './announcement-single.component.css',
})
export class AnnouncementSingleComponent {
  constructor(
    private annoncementService: AnnouncementService,
    private route: ActivatedRoute
  ) {}
  storageUrl = environment.storageUrl;
  currentImage: string = '';
  announcement!: Announcement;
  similarAnnouncements: Announcement[] = [];
  articleId: number = -1;

  ngOnInit() {
    //recharger la page en dunction du nouvel id
    this.route.params.subscribe(params => {
      this.articleId = +params['id'];
      this.getSingleAnnouncement();
      this.getSimilarAnnouncement();
    });
  }


  //function pour recuperr l'annonce en detail
  getSingleAnnouncement(){
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));

    console.log("Id de l'annonce : ", this.articleId);

    this.annoncementService.getAnnoucement(this.articleId).subscribe({
      next: (res) => {
        this.announcement = res.data;
        console.log('Annonce récupérée :', this.announcement);
        // Vérifie que des photos existent, et affecte currentImage
        if (this.announcement.photos && this.announcement.photos.length > 0) {
          this.currentImage = this.announcement.photos[0].url;
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'annonce :", err);
      },
    });
  }


  //function pour recuperr les articles similaires
  getSimilarAnnouncement() {
    this.annoncementService.getSimilarAnnouncements(this.articleId).subscribe(
      (res) => {
        this.similarAnnouncements = res.data;
        console.log('annonces similaires', this.similarAnnouncements);
      },
      (error) => {
        console.error('Erreur de récupération des annonces similaires', error);
      }
    );
  }

  //function pour recuperr changer la photo principale de l'annonce
  changeMainImage(url: string) {
    this.currentImage = url;
  }
}
