import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  private customers: Customer[] = [
    { name: 'Ayesha Noor',   bookings: 14, complaints: 0, joined: 'Jan 2026', status: 'Active'  },
    { name: 'Hamza Sheikh',  bookings:  6, complaints: 1, joined: 'Mar 2026', status: 'Active'  },
    { name: 'Sara Khan',     bookings:  9, complaints: 0, joined: 'Feb 2026', status: 'Active'  },
    { name: 'Bilal Raza',    bookings:  2, complaints: 2, joined: 'Jun 2026', status: 'Active'  },
    { name: 'Fatima Malik',  bookings: 20, complaints: 0, joined: 'Nov 2025', status: 'Active'  },
    { name: 'Waqas Hussain', bookings:  1, complaints: 1, joined: 'Jul 2026', status: 'Blocked' },
  ];

  getAll(): Observable<Customer[]> { return of(this.customers); }

  addCustomer(customer: Customer): Observable<Customer> {
    this.customers.unshift(customer); // Add to the top of the list
    return of(customer);
  }
}
