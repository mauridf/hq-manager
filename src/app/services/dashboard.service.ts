import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResponse, EstatisticasEditorasResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7214/api';

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/Dashboard`);
  }

  getEstatisticasEditoras(): Observable<EstatisticasEditorasResponse> {
    return this.http.get<EstatisticasEditorasResponse>(`${this.apiUrl}/Dashboard/estatisticas-editoras`);
  }
}