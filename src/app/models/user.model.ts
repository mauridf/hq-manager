export interface User {
  id: string;
  email: string;
  criadoEm: Date;
  ultimoLogin: Date;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthResponse {
  sucesso: boolean;
  token: string;
  dataExpiracao: Date;
  mensagem: string;
  usuario: User;
}