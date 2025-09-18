export interface HQ {
  id?: string;
  nome: string;
  nomeOriginal?: string;
  tipoPublicacao: number;
  status: number;
  totalEdicoes: number;
  sinopse: string;
  anoLancamento: number;
  leiturasRecomendadas?: string[];
  imagem?: string;
  tags?: string[];
  personagens?: string[];
  equipes?: string[];
  editoras: string[];
  criadoEm?: Date;
}

export interface HQResponse {
  id: string;
  nome: string;
  nomeOriginal: string;
  tipoPublicacao: number;
  status: number;
  totalEdicoes: number;
  sinopse: string;
  anoLancamento: number;
  leiturasRecomendadas: string[];
  imagem: string;
  tags: string[];
  personagens: string[];
  equipes: string[];
  editoras: string[];
  criadoEm: Date;
}

export interface Edicao {
  id?: string;
  hqId: string;
  titulo: string;
  numero: string;
  sinopse?: string;
  capa?: string;
  lida: boolean;
  obs?: string;
  nota?: number;
  dataLeitura?: Date;
}

export interface EdicaoResponse {
  id: string;
  hqId: string;
  titulo: string;
  numero: string;
  sinopse: string;
  capa: string;
  lida: boolean;
  obs: string;
  nota: number;
  dataLeitura: Date;
}

export interface EstatisticasEdicoes {
  totalEdicoes: number;
  edicoesLidas: number;
  porcentagemConcluida: number;
  mediaNotas: number;
  proximaEdicao: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Enums locais já que não temos endpoints
export const TIPOS_PUBLICACAO = [
  { valor: 0, descricao: 'Mensal' },
  { valor: 1, descricao: 'Minissérie' },
  { valor: 2, descricao: 'Oneshot' },
  { valor: 3, descricao: 'Crossover' },
  { valor: 4, descricao: 'Evento' },
  { valor: 5, descricao: 'FCBD' },
  { valor: 6, descricao: 'Omnibus' },
  { valor: 7, descricao: 'Encadernado' },
  { valor: 8, descricao: 'Online' },
  { valor: 9, descricao: 'Outro' }
];

export const STATUS_HQ = [
  { valor: 0, descricao: 'Em Andamento' },
  { valor: 1, descricao: 'Finalizado' },
  { valor: 2, descricao: 'Cancelado' },
  { valor: 3, descricao: 'Incompleto' }
];