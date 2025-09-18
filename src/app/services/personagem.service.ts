import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Personagem, PersonagemResponse, TipoPersonagem, PaginatedResponse } from '../models/personagem.model';

@Injectable({
  providedIn: 'root'
})
export class PersonagemService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7214/api';

  getPersonagens(page: number = 1, limit: number = 10, nome?: string): Observable<PaginatedResponse<PersonagemResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<PersonagemResponse[]>(`${this.apiUrl}/Personagens`, { params })
      .pipe(
        map((personagens: PersonagemResponse[]) => {
          return {
            items: personagens,
            total: personagens.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(personagens.length / limit)
          };
        }),
        catchError(error => {
          console.error('Erro ao buscar personagens:', error);
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

  getPersonagemById(id: string): Observable<PersonagemResponse> {
    return this.http.get<PersonagemResponse>(`${this.apiUrl}/Personagens/${id}`);
  }

  getPersonagemByNome(nome: string): Observable<PersonagemResponse[]> {
    return this.http.get<PersonagemResponse[]>(`${this.apiUrl}/Personagens/nome/${nome}`);
  }

  getPersonagensByTipo(tipo: number): Observable<PersonagemResponse[]> {
    return this.http.get<PersonagemResponse[]>(`${this.apiUrl}/Personagens/tipo/${tipo}`);
  }

  getTiposPersonagem(): Observable<TipoPersonagem[]> {
    return this.http.get<TipoPersonagem[]>(`${this.apiUrl}/Personagens/tipos`);
  }

  createPersonagem(personagem: Personagem): Observable<PersonagemResponse> {
    return this.http.post<PersonagemResponse>(`${this.apiUrl}/Personagens`, personagem);
  }

  updatePersonagem(id: string, personagem: Personagem): Observable<PersonagemResponse> {
    return this.http.put<PersonagemResponse>(`${this.apiUrl}/Personagens/${id}`, personagem);
  }

  deletePersonagem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Personagens/${id}`);
  }
}