import { Component } from '@angular/core';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
    private route: ActivatedRoute,
    private router : Router
  ) {}
  storageUrl = environment.storageUrl;
  currentImage: string = '';
  announcement!: Announcement;
  similarAnnouncements!: Announcement[];
  articleId: number = -1;
  isConnected : boolean = false;
  token : string = ''

  //menu de partage
  toggleShareMenu = false;
  successMessage:string = '';
  successMessageFav:string = '';
  errorMessage : string = '';

  ngOnInit() {
    //recharger la page en dunction du nouvel id
    this.route.params.subscribe(params => {
      this.articleId = +params['id'];
      this.getSingleAnnouncement();
      this.getSimilarAnnouncement();
      this.isConnectedMethode();
    });
  }
  //mehode login
  isConnectedMethode() {
    const token = localStorage.getItem('token');

    if (token) {
      this.isConnected = true;
      this.token = token;
    }
  }
  //add to favorites
  addTofavorite() {
    const token = localStorage.getItem('token');
    if (token) {
      this.annoncementService.addTofavorite(this.announcement.id).subscribe({
        next: (response: any) => {
          this.successMessageFav = response.message;
          setTimeout(()=>{
            this.successMessageFav = '';
          }, 2500);
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

  //Implementation partage
  get shareUrl(): string {
    //window.location.origin donne : http://localhost:4200 en local et https://urlEnLigne.com en production
    return `${window.location.origin}/announcement/${this.articleId}`;
  }

  //encodeURIComponent() transforme ces caractères spéciaux en un format compréhensible pour un navigateur.
  get encodedShareUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }
  //copier le lien de partage
  copyLink() {
    navigator.clipboard.writeText(this.shareUrl);
    this.successMessage = 'Lien copié avec successe';
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }
}
