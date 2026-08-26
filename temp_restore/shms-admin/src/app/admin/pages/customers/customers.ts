import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent, AvatarInitialsComponent],
  templateUrl: './customers.html',
})
export class CustomersComponent implements OnInit {
  allCustomers = signal<Customer[]>([]);
  customers    = signal<Customer[]>([]);
  searchQuery  = signal<string>('');
  showAddForm  = signal<boolean>(false);

  newCustomer: Customer = {
    name: '',
    bookings: 0,
    complaints: 0,
    joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
    status: 'Active'
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getAll().subscribe(data => {
      this.allCustomers.set(data);
      this.customers.set(data);
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    const q = query.toLowerCase();
    this.customers.set(
      q ? this.allCustomers().filter(c => c.name.toLowerCase().includes(q)) : this.allCustomers()
    );
  }

  toggleAddForm(): void {
    this.showAddForm.set(!this.showAddForm());
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  submitCustomer(): void {
    if (!this.newCustomer.name) return;
    
    this.customerService.addCustomer({ ...this.newCustomer }).subscribe(() => {
      // Reload customers
      this.customerService.getAll().subscribe(data => {
        this.allCustomers.set(data);
        this.onSearch(this.searchQuery());
        this.toggleAddForm();
      });
    });
  }

  private resetForm(): void {
    this.newCustomer = {
      name: '',
      bookings: 0,
      complaints: 0,
      joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      status: 'Active'
    };
  }
}
