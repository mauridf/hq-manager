import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HQ, HQResponse, Edicao, EdicaoResponse, EstatisticasEdicoes, PaginatedResponse } from '../models/hq.model';

@Injectable({
  providedIn: 'root'
})
export class HqService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7214/api';

  getHQs(page: number = 1, limit: number = 10, nome?: string): Observable<PaginatedResponse<HQResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<HQResponse[]>(`${this.apiUrl}/HQs`, { params })
      .pipe(
        map((hqs: HQResponse[]) => {
          return {
            items: hqs,
            total: hqs.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(hqs.length / limit)
          };
        }),
        catchError(error => {
          console.error('Erro ao buscar HQs:', error);
          return of({
            items: [],
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0
          });
        })
      );
  }

  getHQById(id: string): Observable<HQResponse> {
    return this.http.get<HQResponse>(`${this.apiUrl}/HQs/${id}`);
  }

  createHQ(hq: HQ): Observable<HQResponse> {
    return this.http.post<HQResponse>(`${this.apiUrl}/HQs`, hq);
  }

  updateHQ(id: string, hq: HQ): Observable<HQResponse> {
    return this.http.put<HQResponse>(`${this.apiUrl}/HQs/${id}`, hq);
  }

  deleteHQ(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/HQs/${id}`);
  }

  // Métodos para Edições
  getEdicoesByHQ(hqId: string): Observable<EdicaoResponse[]> {
    return this.http.get<EdicaoResponse[]>(`${this.apiUrl}/Edicoes/hq/${hqId}`);
  }

  getEstatisticasEdicoes(hqId: string): Observable<EstatisticasEdicoes> {
    return this.http.get<EstatisticasEdicoes>(`${this.apiUrl}/Edicoes/hq/${hqId}/estatisticas`);
  }

  getEdicaoById(id: string): Observable<EdicaoResponse> {
    return this.http.get<EdicaoResponse>(`${this.apiUrl}/Edicoes/${id}`);
  }

  createEdicao(edicao: Edicao): Observable<EdicaoResponse> {
    return this.http.post<EdicaoResponse>(`${this.apiUrl}/Edicoes`, edicao);
  }

  updateEdicao(id: string, edicao: Edicao): Observable<EdicaoResponse> {
    return this.http.put<EdicaoResponse>(`${this.apiUrl}/Edicoes/${id}`, edicao);
  }

  deleteEdicao(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Edicoes/${id}`);
  }

  marcarComoLida(id: string, lida: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Edicoes/${id}/marcar-lida`, lida);
  }
}