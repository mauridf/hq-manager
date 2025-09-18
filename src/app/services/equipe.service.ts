import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Equipe, EquipeResponse, PaginatedResponse } from '../models/equipe.model';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7214/api';

  getEquipes(page: number = 1, limit: number = 10, nome?: string): Observable<PaginatedResponse<EquipeResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<EquipeResponse[]>(`${this.apiUrl}/Equipes`, { params })
      .pipe(
        map((equipes: EquipeResponse[]) => {
          return {
            items: equipes,
            total: equipes.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(equipes.length / limit)
          };
        }),
        catchError(error => {
          console.error('Erro ao buscar equipes:', error);
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

  getEquipeById(id: string): Observable<EquipeResponse> {
    return this.http.get<EquipeResponse>(`${this.apiUrl}/Equipes/${id}`);
  }

  getEquipeByNome(nome: string): Observable<EquipeResponse[]> {
    return this.http.get<EquipeResponse[]>(`${this.apiUrl}/Equipes/nome/${nome}`);
  }

  createEquipe(equipe: Equipe): Observable<EquipeResponse> {
    return this.http.post<EquipeResponse>(`${this.apiUrl}/Equipes`, equipe);
  }

  updateEquipe(id: string, equipe: Equipe): Observable<EquipeResponse> {
    return this.http.put<EquipeResponse>(`${this.apiUrl}/Equipes/${id}`, equipe);
  }

  deleteEquipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Equipes/${id}`);
  }
}