// Importation des éléments nécessaires à Angular et au formulaire
import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../../../core/models/announcement/category';
import { NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { Announcement } from '../../../core/models/announcement/announcement';
import {FooterComponent} from '../../../components/shared/footer/footer.component';

@Component({
  selector: 'app-create', // Sélecteur utilisé dans le HTML parent
  standalone: true, // Composant autonome (pas besoin d’être déclaré dans un module)
  imports: [ReactiveFormsModule, NgIf, HeaderComponent, NgFor, FooterComponent], // Importation des modules utilisés dans le template HTML
  templateUrl: './create.component.html', // Chemin vers le fichier HTML du composant
  styleUrls: ['./create.component.css'], // Chemin vers le fichier CSS du composant
})
export class CreateComponent implements OnInit {
  // Déclaration du formulaire de création d’annonce
  createAnnoucmentForm!: FormGroup;

  // Indique si le formulaire a été soumis
  isSubmited: boolean = false;

  // Messages de succès ou d'erreur à afficher à l'utilisateur
  errorMsg: string = '';
  successMsg: string = '';

  // Liste des catégories récupérées depuis le backend
  categories: Category[] = [];

  // Liste des annonces existantes (potentiellement pour une vérification ou autre logique)
  announcements!: Announcement[];

  // Fichiers sélectionnés par l’utilisateur
  selectedFiles: File[] = [];

  // URLs des images pour la prévisualisation avant envoi
  previewImages: string[] = [];

  // Injection du service des annonces et du FormBuilder
  constructor(
    private annoucementService: AnnouncementService,
    private fb: FormBuilder
  ) {}

  // Initialisation du composant
  ngOnInit() {
    // Récupération des catégories et annonces dès le chargement
    this.getCategories();

    // Initialisation du formulaire avec validation
    this.createAnnoucmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      operation_type: ['', Validators.required],
      price: [''], 
      state: ['', Validators.required],
      exchange_location_address: ['', Validators.required],
      exchange_location_lng: ['', Validators.required],
      exchange_location_lat: ['', Validators.required],
      category_id: [null, Validators.required],
      photos: [], // Champ pour les fichiers (optionnel)
    });

    // Gestion dynamique de la validation du champ "price"
    this.disablePriceInput();
  }

  // Méthode pour activer ou désactiver la validation du champ "price"
  disablePriceInput() {
    this.createAnnoucmentForm.get('operation_type')?.valueChanges.subscribe((value) => {
      const priceControl = this.createAnnoucmentForm.get('price');

      // Si l'utilisateur choisit "vente", on rend "price" requis
      if (value === 'sale') {
        priceControl?.setValidators([Validators.required]);
      } else {
        // Sinon, on retire la validation
        priceControl?.clearValidators();
        priceControl?.setValue(null);
      }

      // Mise à jour de la validité du champ
      priceControl?.updateValueAndValidity();
    });
  }

  // Récupère les catégories depuis l'API
  getCategories() {
    this.annoucementService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data; // Stocke les catégories dans la propriété du composant
        console.log('Catégories:', this.categories); // Debug
      },
    });
  }


  // Gère le changement de fichiers dans l’input type="file"
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      // Convertit la FileList en tableau
      this.selectedFiles = Array.from(event.target.files);
      this.previewImages = [];

      // Pour chaque fichier, on lit son contenu pour afficher l’aperçu
      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result); // Ajoute l’aperçu (base64)
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Supprime un fichier de la sélection (et son aperçu)
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1); // Supprime le fichier
    this.previewImages.splice(index, 1); // Supprime l’aperçu
  }

  // Soumission du formulaire
  onSubmit() {
    this.isSubmited = true; // Indique que le formulaire a été soumis
    this.errorMsg = '';
    this.successMsg = '';

    // Vérifie la validité du formulaire
    if (this.createAnnoucmentForm.invalid) {
      return;
    }

    // Vérifie si des photos ont été sélectionnées (obligatoire)
    if (this.selectedFiles.length === 0) {
      this.errorMsg = 'Veuillez ajouter au moins une photo pour votre annonce.';
      return;
    }

    // Prépare les données sous forme de FormData (pour inclure les fichiers)
    const formData = new FormData();
    const formValue = this.createAnnoucmentForm.value;

    // Ajoute tous les champs du formulaire dans le FormData
    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key]);
      }
    }

    // Ajoute les fichiers dans le FormData
    this.selectedFiles.forEach((file) => {
      formData.append('photos[]', file);
    });

    // Envoie des données au backend via le service
    this.annoucementService.createAnnouncement(formData).subscribe({
      next: (res) => {
        // Si succès : affiche message, reset formulaire et fichiers
        this.successMsg = 'Annonce créée avec succès !';
        this.isSubmited = false;
        this.createAnnoucmentForm.reset();
        this.selectedFiles = [];
        this.previewImages = [];
        console.log(res);
        setTimeout(()=>{
          this.successMsg = ''
        }, 2000)
      },
      error: (err) => {
        // Si erreur : message d'erreur
        this.errorMsg = err.error.message || 'Une erreur est survenue.';
        this.isSubmited = false;
        setTimeout(()=>{
          this.errorMsg = ''
        }, 2000)
      },
    });
  }
}
