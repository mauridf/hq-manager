import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Editora, EditoraResponse, PaginatedResponse } from '../models/editora.model';

@Injectable({
  providedIn: 'root'
})
export class EditoraService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7214/api';

  getEditoras(page: number = 1, limit: number = 10, nome?: string): Observable<PaginatedResponse<EditoraResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<EditoraResponse[]>(`${this.apiUrl}/Editoras`, { params })
      .pipe(
        map((editoras: EditoraResponse[]) => {
          // Transformar o array simples em PaginatedResponse
          return {
            items: editoras,
            total: editoras.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(editoras.length / limit)
          };
        }),
        catchError(error => {
          console.error('Erro ao buscar editoras:', error);
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

  getEditoraById(id: string): Observable<EditoraResponse> {
    return this.http.get<EditoraResponse>(`${this.apiUrl}/Editoras/${id}`);
  }

  getEditoraByNome(nome: string): Observable<EditoraResponse> {
    return this.http.get<EditoraResponse>(`${this.apiUrl}/Editoras/nome/${nome}`);
  }

  createEditora(editora: Editora): Observable<EditoraResponse> {
    return this.http.post<EditoraResponse>(`${this.apiUrl}/Editoras`, editora);
  }

  updateEditora(id: string, editora: Editora): Observable<EditoraResponse> {
    return this.http.put<EditoraResponse>(`${this.apiUrl}/Editoras/${id}`, editora);
  }

  deleteEditora(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Editoras/${id}`);
  }
}