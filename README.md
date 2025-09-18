# HQManager - Frontend

📋 Descrição
HQManager é um sistema completo para gerenciamento de coleções de histórias em quadrinhos. Este frontend foi desenvolvido em Angular 17 com Angular Material UI, proporcionando uma interface moderna e responsiva para gerenciar editoras, personagens, equipes e HQs.

✨ Funcionalidades
🔐 Autenticação
- Login de usuários
- Registro de novos usuários
- Gestão de sessão com token JWT
- Proteção de rotas automática

📚 Gestão de Conteúdo
- Editoras - Cadastro e gerenciamento de editoras
- Personagens - Controle de personagens com tipos específicos (Herói, Vilão, etc.)
- Equipes - Gerenciamento de equipes de personagens
- HQs - Sistema completo de gerenciamento de histórias em quadrinhos
- Edições - Controle detalhado das edições de cada HQ

🎨 Interface
- Design Material seguindo as diretrizes do Angular Material
- Layout responsivo para desktop e mobile
- Temas com suporte a light/dark mode
- Componentes reutilizáveis e modulares

🛠️ Tecnologias Utilizadas
- Angular 17 - Framework principal
- Angular Material - Componentes UI
- TypeScript - Linguagem de programação
- RxJS - Programação reativa
- HTML5 & SCSS - Estilização e markup
- JWT - Autenticação por tokens

📦 Estrutura do Projeto
```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Cabeçalho com navegação
│   │   ├── sidebar/          # Menu lateral
│   │   ├── data-table/       # Tabela reutilizável
│   │   ├── confirm-dialog/   # Diálogo de confirmação
│   │   ├── descricao-dialog/ # Modal para descrições
│   │   ├── hq-form/          # Formulário de HQs
│   │   ├── edicao-form/      # Formulário de edições
│   │   └── edicoes-dialog/   # Gestão de edições
│   ├── pages/
│   │   ├── login/            # Página de login
│   │   ├── register/         # Página de registro
│   │   ├── home/             # Dashboard inicial
│   │   ├── editoras/         # Gestão de editoras
│   │   ├── personagens/      # Gestão de personagens
│   │   ├── equipes/          # Gestão de equipes
│   │   └── hqs/              # Gestão de HQs e edições
│   ├── services/
│   │   ├── auth.service.ts   # Serviço de autenticação
│   │   ├── editora.service.ts
│   │   ├── personagem.service.ts
│   │   ├── equipe.service.ts
│   │   └── hq.service.ts
│   ├── models/               # Interfaces e tipos
│   ├── interfaces/           # Interfaces auxiliares
│   ├── interceptors/         # Interceptores HTTP
│   └── utils/                # Utilitários
```

🚀 Como Executar
### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Angular CLI 17+

### Instalação
Clone o repositório
```bash
git clone <url-do-repositorio>
cd hq-manager-frontend
```

Instale as dependências
```bash
npm install
# ou
yarn install
```

Configure a API
```bash
# Edite o arquivo src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7214/api'
};
```

Execute o projeto
```bash
ng serve
# ou
npm start
```

Acesse a aplicação
```
http://localhost:4200
```

📡 API Integration
O frontend consome os seguintes endpoints:

**Autenticação**
- POST /api/auth/login - Login de usuário
- POST /api/usuarios - Registro de usuário

**Editoras**
- GET /api/Editoras - Listar editoras
- POST /api/Editoras - Criar editora
- PUT /api/Editoras/{id} - Atualizar editora
- DELETE /api/Editoras/{id} - Excluir editora

**Personagens**
- GET /api/Personagens - Listar personagens
- POST /api/Personagens - Criar personagem
- GET /api/Personagens/tipos - Tipos de personagem

**Equipes**
- GET /api/Equipes - Listar equipes
- POST /api/Equipes - Criar equipe

**HQs**
- GET /api/HQs - Listar HQs
- POST /api/HQs - Criar HQ
- GET /api/HQs/{id} - Buscar HQ por ID

**Edições**
- GET /api/Edicoes/hq/{hqId} - Edições da HQ
- POST /api/Edicoes - Criar edição
- PATCH /api/Edicoes/{id}/marcar-lida - Marcar como lida

🎨 Componentes Principais
**DataTableComponent**
Componente reutilizável para exibição de dados tabulares com:
- Paginação
- Pesquisa em tempo real
- Ordenação
- Ações personalizadas
- Suporte a tipos de coluna (texto, imagem, link, etc.)

**Sistema de Formulários**
- Validação robusta com Angular Forms
- Formulários reativos
- Validação em tempo real
- Mensagens de erro contextualizadas

**Modais e Diálogos**
- Sistema de modais consistente
- Formulários em overlays
- Confirmações de exclusão
- Visualização de conteúdo extenso

🔒 Segurança
- Autenticação JWT com armazenamento seguro
- Interceptores para incluir tokens automaticamente
- Guards de rota para proteção de páginas
- Validação de token e expiração
- Logout automático por inatividade

📱 Responsividade
O sistema é totalmente responsivo com breakpoints para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

🧪 Testes
Para executar os testes:
```bash
# Testes unitários
ng test

# Testes end-to-end
ng e2e

# Geração de coverage
ng test --code-coverage
```

📦 Build e Deploy
```bash
# Build de produção
ng build --configuration production

# Build de desenvolvimento
ng build

# Análise do bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

🌐 Deploy
**Docker**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/hq-manager /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

**Deploy em servidor**
```bash
# Build do projeto
ng build --configuration production

# Upload dos arquivos da pasta dist/ para o servidor
```

🤝 Contribuição
1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

🆘 Suporte
Para dúvidas e suporte:
- 📧 Email: mauridf@gmail.com
- 🐛 Issues: GitHub Issues

🔄 Changelog
**v1.0.0**
- ✅ Sistema de autenticação completo
- ✅ CRUD de Editoras, Personagens, Equipes e HQs
- ✅ Gestão de edições de HQs
- ✅ Interface responsiva com Angular Material
- ✅ Integração com API backend

---
Desenvolvido com ❤️ por Maurício Oliveira Developer
