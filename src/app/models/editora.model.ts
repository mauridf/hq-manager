export interface Editora {
  id?: string;
  nome: string;
  anoCriacao: number;
  logotipo?: string;
  paisOrigem: string;
  siteOficial?: string;
}

export interface EditoraResponse {
  id: string;
  nome: string;
  anoCriacao: number;
  logotipo: string;
  paisOrigem: string;
  siteOficial: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}