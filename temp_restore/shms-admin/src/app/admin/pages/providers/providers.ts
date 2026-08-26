import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent, AvatarInitialsComponent],
  templateUrl: './providers.html',
})
export class ProvidersComponent implements OnInit {
  allProviders  = signal<Provider[]>([]);
  providers     = signal<Provider[]>([]);
  activeFilter  = signal<string>('All');
  searchQuery   = signal<string>('');
  showAddForm   = signal<boolean>(false);

  newProvider: Provider = {
    name: '',
    expertise: '',
    experience: '',
    rating: null,
    status: 'Pending'
  };

  readonly filters = ['All', 'Plumbing', 'Electrical', 'Sanitary', 'Pending', 'Blocked'];

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.providerService.getAll().subscribe(data => {
      this.allProviders.set(data);
      this.providers.set(data);
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.applyFilters();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.allProviders();
    const filter = this.activeFilter();
    const query  = this.searchQuery().toLowerCase();

    if (filter !== 'All') {
      result = result.filter(p =>
        filter === 'Pending' || filter === 'Blocked'
          ? p.status === filter
          : p.expertise.toLowerCase().includes(filter.toLowerCase())
      );
    }
    if (query) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.expertise.toLowerCase().includes(query)
      );
    }
    this.providers.set(result);
  }

  toggleAddForm(): void {
    this.showAddForm.set(!this.showAddForm());
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  submitProvider(): void {
    if (!this.newProvider.name || !this.newProvider.expertise || !this.newProvider.experience) return;
    
    this.providerService.addProvider({ ...this.newProvider }).subscribe(() => {
      // Reload providers
      this.providerService.getAll().subscribe(data => {
        this.allProviders.set(data);
        this.applyFilters();
        this.toggleAddForm();
      });
    });
  }

  private resetForm(): void {
    this.newProvider = {
      name: '',
      expertise: '',
      experience: '',
      rating: null,
      status: 'Pending'
    };
  }
}
