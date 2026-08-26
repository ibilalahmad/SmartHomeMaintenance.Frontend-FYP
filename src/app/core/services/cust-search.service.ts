import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProviderService } from './provider.service';
import { Provider } from '../models/provider.model';
import { CustAuthService } from './cust-auth.service';

export interface SearchFilters {
  keyword: string;
  location: string;
  expertise: string;
  minRating: number;
  experience: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustSearchService {
  private readonly providerService = inject(ProviderService);
  private readonly authService = inject(CustAuthService);
  
  private readonly FAVORITES_KEY = 'servifix_cust_favorites';
  
  // Keep track of favorite IDs for the current user (in a real app this is per user, here we use localstorage with user id)
  readonly favorites = signal<string[]>(this.loadFavorites());

  constructor() {}

  searchProviders(filters: SearchFilters): Observable<Provider[]> {
    return this.providerService.getAll().pipe(
      map(providers => providers.filter(p => p.status === 'Active')), // Only active providers
      map(providers => {
        let results = providers;

        if (filters.keyword) {
          const lowerKw = filters.keyword.toLowerCase();
          results = results.filter(p => 
            p.fullName.toLowerCase().includes(lowerKw) || 
            p.expertise.toLowerCase().includes(lowerKw) ||
            p.location.toLowerCase().includes(lowerKw)
          );
        }

        if (filters.location) {
          results = results.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        if (filters.expertise) {
          results = results.filter(p => p.expertise.toLowerCase().includes(filters.expertise.toLowerCase()));
        }

        if (filters.minRating > 0) {
          results = results.filter(p => (p.avgRating || 0) >= filters.minRating);
        }

        if (filters.experience) {
          // Simple string match for experience (e.g. "5 Years")
          results = results.filter(p => (p.workExperience.toString() || '').toLowerCase().includes(filters.experience.toLowerCase()));
        }

        return results;
      })
    );
  }

  // Favorites Logic (FR-CUST-89 to 90)
  private loadFavorites(): string[] {
    const custId = this.authService.currentCustomer()?.customerId;
    if (!custId) return [];
    return JSON.parse(localStorage.getItem(`${this.FAVORITES_KEY}_${custId}`) || '[]');
  }

  private saveFavorites(favs: string[]): void {
    const custId = this.authService.currentCustomer()?.customerId;
    if (custId) {
      localStorage.setItem(`${this.FAVORITES_KEY}_${custId}`, JSON.stringify(favs));
    }
  }

  toggleFavorite(providerId: string): void {
    const currentFavs = this.favorites();
    const idx = currentFavs.indexOf(providerId);
    let newFavs = [...currentFavs];
    if (idx > -1) {
      newFavs.splice(idx, 1);
    } else {
      newFavs.push(providerId);
    }
    this.favorites.set(newFavs);
    this.saveFavorites(newFavs);
  }

  isFavorite(providerId: string): boolean {
    return this.favorites().includes(providerId);
  }
  
  getFavoriteProviders(): Observable<Provider[]> {
     return this.providerService.getAll().pipe(
       map(providers => providers.filter(p => this.favorites().includes(p.providerId.toString())))
     );
  }
}
