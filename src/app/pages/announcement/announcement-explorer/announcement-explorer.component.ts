import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { PaginationMeta, PaginationUrls } from '../../../core/models/announcement/pagination';
import {HeaderComponent} from '../../../components/shared/header/header.component';
import {NgClass, NgFor, NgForOf, NgIf} from '@angular/common';
import {AnnouncementCardComponent} from '../announcement-card/announcement-card.component';
import {FooterComponent} from '../../../components/shared/footer/footer.component';

@Component({
  selector: 'app-announcement-explorer',
  templateUrl: './announcement-explorer.component.html',
  styleUrls: ['./announcement-explorer.component.css'],
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
  announcements: Announcement[] = [];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  isFiltersOpen: boolean = false;
  isLoading: boolean = false;
  noResults: boolean = false;
  isEmpty = false;

  filterForm!: FormGroup;

  constructor(
    private announcementService: AnnouncementService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.getAnnouncements();
  }

  initForm() {
    this.filterForm = this.fb.group({
      search: [''],
      operation_type: this.fb.group({
        sale: [false],
        exchange: [false],
        don : [false],
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

  getAnnouncements(page: number = 1) {
    this.isLoading = true;
    const formValue = this.filterForm.value;

    // Nettoyage des filtres
    const operationType = Object.entries(formValue.operation_type)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const state = Object.entries(formValue.state)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const filters: any = {};

    if (formValue.search) filters.search = formValue.search;
    if (operationType.length > 0) filters.operation_type = operationType;
    if (state.length > 0) filters.state = state;

    if (formValue.min_price !== null && formValue.min_price !== 0) {
      filters.min_price = formValue.min_price;
    }

    if (formValue.max_price !== null && formValue.max_price !== 50) {
      filters.max_price = formValue.max_price;
    }

    console.log('Filtres envoyés:', filters);

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


  onSubmit(): void {
    this.getAnnouncements(); // Relancer la recherche
  }

  onPageChange(url: string | null | undefined): void {
    if (!url) return;
    const pageParam = new URL(url).searchParams.get('page');
    const page = pageParam ? +pageParam : 1;

    this.getAnnouncements(page);
  }


  toggleFilters(): void {
    this.isFiltersOpen = !this.isFiltersOpen;
  }
}
