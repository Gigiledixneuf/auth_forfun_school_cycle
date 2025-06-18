import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { PaginationMeta, PaginationUrls } from '../../../core/models/announcement/pagination';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AnnouncementCardComponent } from '../announcement-card/announcement-card.component';
import { FooterComponent } from '../../../components/shared/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-announcement-explorer',
  templateUrl: './announcement-explorer.component.html',
  styleUrls: ['./announcement-explorer.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    NgClass,
    AnnouncementCardComponent,
    NgFor,
    NgIf,
    FooterComponent
  ]
})
export class AnnouncementExplorerComponent implements OnInit {
  // Données des annonces
  announcements: Announcement[] = [];

  // Données de pagination
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;

  // États de l’interface
  isFiltersOpen = false;
  isLoading = false;
  noResults = false;
  isEmpty = false;

  // Formulaire de filtres
  filterForm!: FormGroup;

  constructor(
    private announcementService: AnnouncementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,  // Pour récupérer les paramètres de l’URL
    private router: Router          // Pour mettre à jour l’URL
  ) {}

  ngOnInit() {
    // Initialisation du formulaire
    this.initForm();
    this.paramsFiltre();

  }

  paramsFiltre(){
    // Lorsqu’il y a un changement dans les paramètres d’URL (ex: ?search=..., ?min_price=...)
    this.route.queryParams.subscribe(params => {
      const formValue = this.filterForm.value;

      // Appliquer les valeurs de l’URL dans le formulaire
      if (params['search']) formValue.search = params['search'];
      if (params['operation_type']) {
        const ops = params['operation_type'].split(',');
        formValue.operation_type = this.mapToCheckboxObject(ops);
      }
      if (params['state']) {
        const states = params['state'].split(',');
        formValue.state = this.mapToCheckboxObject(states);
      }
      if (params['min_price']) formValue.min_price = +params['min_price'];
      if (params['max_price']) formValue.max_price = +params['max_price'];

      // Appliquer les valeurs dans le formulaire
      this.filterForm.setValue(formValue);

      // Charger les annonces avec les filtres de l’URL
      this.getAnnouncements(+params['page'] || 1);
    });
  }
  // Initialisation des champs du formulaire
  initForm() {
    this.filterForm = this.fb.group({
      search: [''],
      operation_type: this.fb.group({
        sale: [false],
        exchange: [false],
        don: [false],
      }),
      state: this.fb.group({
        new: [false],
        like_new: [false],
        used: [false],
      }),
      min_price: null,
      max_price: null,
    });
  }

  // Récupération des annonces avec filtres
  getAnnouncements(page: number = 1) {
    this.isLoading = true;

    const formValue = this.filterForm.value;

    // Filtrer les types d’opération cochés
    const operationType = Object.entries(formValue.operation_type)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Filtrer les états cochés
    const state = Object.entries(formValue.state)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Construction des filtres à envoyer à l’API
    const filters: any = {};
    if (formValue.search) filters.search = formValue.search;
    if (operationType.length > 0) filters.operation_type = operationType;
    if (state.length > 0) filters.state = state;
    if (formValue.min_price !== null && this.filterForm.get('min_price')?.dirty) {
      filters.min_price = formValue.min_price;
    }
    if (formValue.max_price !== null && this.filterForm.get('max_price')?.dirty) {
      filters.max_price = formValue.max_price;
    }

    // Mise à jour de l’URL avec les filtres
    const queryParams: any = {
      page,
      ...(filters.search && { search: filters.search }),
      ...(operationType.length > 0 && { operation_type: operationType.join(',') }),
      ...(state.length > 0 && { state: state.join(',') }),
      ...(filters.min_price != null && { min_price: filters.min_price }),
      ...(filters.max_price != null && { max_price: filters.max_price }),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // conserve les autres paramètres existants
    });

    // Affichage dans la console (debug)
    console.log('Filtres envoyés:', filters);

    // Appel de l'API
    this.announcementService.getAnnouncements(page, filters).subscribe({
      next: (res) => {
        this.announcements = res.data;
        this.paginationMeta = res.meta;
        this.paginationUrls = res.links;
        this.noResults = this.announcements.length === 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces :', err);
        this.isLoading = false;
        this.noResults = true;
      },
    });
  }

  // Lorsqu’on clique sur le bouton "Filtrer"
  onSubmit(): void {
    this.getAnnouncements(); // recharge avec les filtres
  }

  // Gestion de la pagination (clic sur une page)
  onPageChange(url: string | null | undefined): void {
    if (!url) return;
    const pageParam = new URL(url).searchParams.get('page');
    const page = pageParam ? +pageParam : 1;
    this.getAnnouncements(page);
  }

  // Ouvre/ferme le menu de filtres
  toggleFilters(): void {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  // Transforme un tableau ['sale', 'don'] en objet { sale: true, don: true }
  private mapToCheckboxObject(values: string[]): any {
    const obj: any = {};
    values.forEach(val => obj[val] = true);
    return obj;
  }

  // Réinitialise les filtres et recharge les annonces
  onResetFilters(): void {
    // Réinitialiser les champs du formulaire
    this.filterForm.reset({
      search: '',
      operation_type: {
        sale: false,
        exchange: false,
        don: false,
      },
      state: {
        new: false,
        like_new: false,
        used: false,
      },
      min_price: null,
      max_price: null
    });

    // Nettoyer l’URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: '', // Remplace complètement les query params
    });

    // Recharger les annonces sans filtre
    this.getAnnouncements(1);
  }

}
