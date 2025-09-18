export interface Equipe {
  id?: string;
  nome: string;
  descricao: string;
  imagem?: string;
  anoCriacao: number;
}

export interface EquipeResponse {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  anoCriacao: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}