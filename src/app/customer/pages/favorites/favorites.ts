import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustSearchService } from '../../../core/services/cust-search.service';
import { Provider } from '../../../core/models/provider.model';

@Component({
  selector: 'app-cust-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: '../search/search.css'
})
export class Favorites implements OnInit {
  private readonly searchService = inject(CustSearchService);

  readonly favoriteProviders = signal<Provider[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading.set(true);
    this.searchService.getFavoriteProviders().subscribe({
      next: (provs) => {
        this.favoriteProviders.set(provs);
        this.isLoading.set(false);
      }
    });
  }

  removeFavorite(providerId: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.searchService.toggleFavorite(providerId);
    this.loadFavorites(); // refresh list
  }
}
