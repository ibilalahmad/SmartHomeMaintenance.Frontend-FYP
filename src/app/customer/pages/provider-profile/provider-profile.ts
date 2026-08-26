import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CustSearchService } from '../../../core/services/cust-search.service';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { CustAuthService } from '../../../core/services/cust-auth.service';

@Component({
  selector: 'app-cust-provider-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './provider-profile.html',
  styleUrl: './provider-profile.css'
})
export class ProviderProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerService = inject(ProviderService);
  private readonly searchService = inject(CustSearchService);
  private readonly authService = inject(CustAuthService);

  readonly provider = signal<Provider | null>(null);
  readonly isLoading = signal(true);
  readonly isFavorite = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.providerService.getProviderById(Number(id)).subscribe({
        next: (prov) => {
          this.provider.set(prov || null);
          if (prov) {
            this.isFavorite.set(this.searchService.isFavorite(prov.providerId.toString()));
          }
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  toggleFavorite() {
    const prov = this.provider();
    if (prov) {
      this.searchService.toggleFavorite(prov.providerId.toString());
      this.isFavorite.set(this.searchService.isFavorite(prov.providerId.toString()));
    }
  }

  bookNow() {
    const prov = this.provider();
    if (!prov) return;
    
    // FR-CUST-40: Prominent if logged in... redirects to login otherwise.
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Navigate to booking process (to be implemented in Phase 3)
    // For now we'll route to a hypothetical booking page
    this.router.navigate(['/customer/book', prov.providerId.toString()]);
  }
}
