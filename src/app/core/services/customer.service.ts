import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, UpdateCustomer } from '../models/customer.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.apiUrl}`; // Base API URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> { 
    return this.http.get<Customer[]>(`${this.apiUrl}/Admin/customers`);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/Customers/${id}`);
  }

  createCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register/customer`, customerData);
  }

  updateCustomer(id: number, customer: UpdateCustomer): Observable<any> {
    return this.http.put(`${this.apiUrl}/Customers/${id}`, customer);
  }

  toggleCustomerActiveStatus(id: number, isActive: boolean): Observable<any> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.http.put(`${this.apiUrl}/Admin/users/${id}/status`, {}, { params });
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Admin/customers/${id}`);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Customers/${id}`);
  }

  anonymizeCustomer(id: number): Observable<any> {
    // Left as mock placeholder since schema didn't define it
    const anonymizedData: UpdateCustomer = {
      fullName: 'Anonymized User',
      phoneNumber: '0000-0000000',
      address: 'Unknown',
      preferredPayment: null,
      defaultAddress: null,
      profilePic: null
    };
    return this.http.put(`${this.apiUrl}/Customers/${id}`, anonymizedData);
  }
}
