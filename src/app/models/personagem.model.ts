export interface Personagem {
  id?: string;
  nome: string;
  tipo: number;
  descricao: string;
  imagem?: string;
  primeiraAparicao: string;
}

export interface PersonagemResponse {
  id: string;
  nome: string;
  tipo: number;
  descricao: string;
  imagem: string;
  primeiraAparicao: string;
}

export interface TipoPersonagem {
  valor: number;
  nome: string;
  descricao: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}