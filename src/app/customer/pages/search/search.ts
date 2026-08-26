import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustSearchService, SearchFilters } from '../../../core/services/cust-search.service';
import { Provider } from '../../../core/models/provider.model';

@Component({
  selector: 'app-cust-search',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  private readonly searchService = inject(CustSearchService);

  readonly providers = signal<Provider[]>([]);
  readonly isLoading = signal(true);

  // Filters
  filters: SearchFilters = {
    keyword: '',
    location: '',
    expertise: '',
    minRating: 0,
    experience: ''
  };

  readonly expertises = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'AC Repair', 'Painting', 'Appliance Repair'];
  readonly locations = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.isLoading.set(true);
    this.searchService.searchProviders(this.filters).subscribe({
      next: (results) => {
        this.providers.set(results);
        this.isLoading.set(false);
      }
    });
  }

  clearFilters() {
    this.filters = { keyword: '', location: '', expertise: '', minRating: 0, experience: '' };
    this.applyFilters();
  }

  toggleFavorite(providerId: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.searchService.toggleFavorite(providerId);
  }

  isFavorite(providerId: string): boolean {
    return this.searchService.isFavorite(providerId);
  }
}
