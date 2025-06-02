# API do Sistema de Compras Online

Esta é uma API backend para um sistema de compras online construída com NestJS, TypeScript e SQLite. Ela oferece funcionalidades para gerenciamento de produtos, operações de carrinho de compras, autenticação de usuários e processamento de pedidos.

## Funcionalidades

- **Gerenciamento de Produtos**: Operações CRUD para produtos, incluindo busca por critérios
- **Carrinho de Compras**: Adicionar, remover e atualizar itens no carrinho
- **Autenticação de Usuários**: Registro e login com JWT
- **Processamento de Pedidos**: Processo de finalização de compra e histórico de pedidos
- **Documentação da API**: Documentação Swagger/OpenAPI

## Pré-requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/yourusername/online-shopping-api.git
cd online-shopping-api
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
# Aplicação
NODE_ENV=development
PORT=3000

# Autenticação
JWT_SECRET=sua_chave_secreta_jwt_aqui
JWT_EXPIRATION=1d
```

## Executando a Aplicação

### Modo de Desenvolvimento

```bash
npm run start:dev
```

A aplicação estará disponível em http://localhost:3000.

### Modo de Produção

```bash
npm run build
npm run start:prod
```

## Documentação da API

A documentação Swagger está disponível em http://localhost:3000/api quando a aplicação estiver em execução.

## Endpoints da API

### Autenticação

- `POST /auth/register` - Registrar um novo usuário
- `POST /auth/login` - Fazer login e obter token JWT

### Produtos

- `GET /products` - Obter todos os produtos (com filtros)
- `GET /products/:id` - Obter um produto específico
- `POST /products` - Criar um novo produto (somente admin)
- `PATCH /products/:id` - Atualizar um produto (somente admin)
- `DELETE /products/:id` - Excluir um produto (somente admin)

### Carrinho de Compras

- `GET /cart` - Obter o carrinho do usuário
- `POST /cart` - Adicionar produto ao carrinho
- `PATCH /cart/:id` - Atualizar a quantidade de um item no carrinho
- `DELETE /cart/:id` - Remover item do carrinho
- `DELETE /cart` - Limpar o carrinho

### Pedidos

- `POST /orders` - Criar um novo pedido a partir do carrinho
- `GET /orders` - Obter os pedidos do usuário
- `GET /orders/:id` - Obter um pedido específico
- `PATCH /orders/:id/status` - Atualizar o status do pedido (somente admin)
- `GET /orders/all` - Obter todos os pedidos (somente admin)

### Usuários

- `GET /users/profile` - Obter o perfil do usuário atual
- `PATCH /users/:id` - Atualizar o perfil do usuário
- `GET /users` - Obter todos os usuários (somente admin)
- `DELETE /users/:id` - Excluir um usuário (somente admin)

## Testes

### Executando Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Banco de Dados

A aplicação utiliza SQLite como banco de dados, armazenado no arquivo `database.sqlite` na raiz do projeto. No modo de desenvolvimento, o esquema do banco de dados é criado automaticamente usando o TypeORM synchronize.

## Estrutura do Projeto

```
src/
├── auth/                  # Módulo de autenticação
├── cart/                  # Módulo de carrinho de compras
├── common/                # Utilitários comuns, decoradores, etc.
├── orders/                # Módulo de pedidos
├── products/              # Módulo de produtos
├── users/                 # Módulo de usuários
├── app.module.ts          # Módulo principal da aplicação
└── main.ts                # Ponto de entrada da aplicação
```

## Controle de Acesso Baseado em Papéis

A aplicação suporta dois papéis:
- **Usuário**: Pode gerenciar seu carrinho, realizar pedidos e visualizar seu perfil
- **Admin**: Pode gerenciar produtos, visualizar todos os pedidos e atualizar o status dos pedidos

## Exemplos de Requisições à API

### Registrar um Novo Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "fullName": "João Silva",
    "password": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

### Criar um Produto (Somente Admin)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "name": "Fones de Ouvido Sem Fio",
    "description": "Fones de ouvido sem fio de alta qualidade com cancelamento de ruído",
    "price": 99.99,
    "stockQuantity": 100,
    "category": "Eletrônicos",
    "imageUrl": "https://exemplo.com/fones.jpg"
  }'
```

### Adicionar Produto ao Carrinho

```bash
curl -X POST http://localhost:3000/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "productId": "uuid-do-produto-aqui",
    "quantity": 2
  }'
```

### Criar um Pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "shippingAddress": "Rua Principal, 123, Cidade Qualquer, CQ 12345"
  }'
```

## Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.
