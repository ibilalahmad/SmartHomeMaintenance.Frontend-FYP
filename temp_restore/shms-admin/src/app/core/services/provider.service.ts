import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Provider } from '../models/provider.model';

@Injectable({ providedIn: 'root' })
export class ProviderService {

  private providers: Provider[] = [
    { name: 'Imran Plumbing Co.',   expertise: 'Plumbing, Sanitary',       experience: '9 yrs', rating: 4.8,  status: 'Active'  },
    { name: 'Bright Spark Electric',expertise: 'Electrical',                experience: '6 yrs', rating: 4.6,  status: 'Active'  },
    { name: 'CleanPro Sanitary',    expertise: 'Sanitary Work',             experience: '4 yrs', rating: 4.3,  status: 'Active'  },
    { name: 'Volt Masters',         expertise: 'Electrical, Appliances',    experience: '7 yrs', rating: 4.7,  status: 'Active'  },
    { name: 'QuickFix Repairs',     expertise: 'Plumbing, Electrical',      experience: '3 yrs', rating: 3.1,  status: 'Blocked' },
    { name: 'Usman Tariq',          expertise: 'Electrical, Appliances',    experience: '2 yrs', rating: null, status: 'Pending' },
  ];

  getAll(): Observable<Provider[]> { return of(this.providers); }

  addProvider(provider: Provider): Observable<Provider> {
    this.providers.unshift(provider); // Add to the top of the list
    return of(provider);
  }
}
