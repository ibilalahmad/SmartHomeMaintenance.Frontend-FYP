import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider, UpdateServiceProvider } from '../models/provider.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Provider[]> { 
    // Usually Admin gets all including pending, or public gets approved ones.
    return this.http.get<Provider[]>(`${this.apiUrl}/ServiceProviders`);
  }
  
  getAllForAdmin(): Observable<Provider[]> { 
    return this.http.get<Provider[]>(`${this.apiUrl}/Admin/service-providers`);
  }

  getProviderById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.apiUrl}/ServiceProviders/${id}`);
  }

  createProvider(providerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register/service-provider`, providerData);
  }

  updateProvider(id: number, provider: UpdateServiceProvider): Observable<any> {
    return this.http.put(`${this.apiUrl}/ServiceProviders/${id}`, provider);
  }

  toggleProviderActiveStatus(id: number, isActive: boolean): Observable<any> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.http.put(`${this.apiUrl}/Admin/users/${id}/status`, {}, { params });
  }

  deleteProvider(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Admin/service-providers/${id}`);
  }

  approveProvider(id: number, isApproved: boolean): Observable<any> {
    const params = new HttpParams().set('isApproved', isApproved.toString());
    return this.http.put(`${this.apiUrl}/Admin/service-providers/${id}/approve`, {}, { params });
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ServiceProviders/${id}`);
  }
}
