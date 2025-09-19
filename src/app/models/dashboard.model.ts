export interface DashboardEstatisticas {
  totalHQs: number;
  totalPersonagens: number;
  totalEquipes: number;
  totalEdicoesLidas: number;
  notaMedia: number;
}

export interface HQRecente {
  id: string;
  nome: string;
  progresso: string;
  status: string;
  edicoesLidas: number;
  totalEdicoes: number;
}

export interface DashboardResponse {
  estatisticas: DashboardEstatisticas;
  hQsRecentes: HQRecente[];
}

export interface EstatisticaEditora {
  editoraNome: string;
  editoraId: string;
  totalHQs: number;
  hQsEmAndamento: number;
  hQsFinalizadas: number;
  hQsCanceladas: number;
  hQsIncompletas: number;
  totalEdicoes: number;
  edicoesLidas: number;
}

export interface EstatisticasEditorasResponse {
  estatisticas: EstatisticaEditora[];
}