# 💳 Bank API - Teste Técnico

API desenvolvida em NestJS para controle de usuários, contas bancárias e transações financeiras. Projeto realizado como parte de um teste prático para contratação.

## 🚀 Funcionalidades

- Autenticação com JWT
- Criação e login de usuários
- Validação de CPF
- Abertura de contas bancárias com número gerado aleatoriamente
- Atualização de dados da conta (com verificação e preservação de campos)
- Transações bancárias:
  - Depósito
  - Saque (com verificação de limite de crédito)
- Registro de histórico de transações com status e erro, se houver
- Consulta de transações por conta

## 🛠️ Tecnologias

- Node.js / NestJS
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Bcrypt para hash de senha
- Pino para logs

## ⚙️ Instalação

```bash
git clone https://github.com/LucasPessutte/bank-api.git
cd bank-api
pnpm install
docker-compose up -d
```

Crie um arquivo `.env` com as variáveis:

```
PORT=3000
DATABASE_URL="mysql://root:admin@localhost:3308/db_name"
JWT_SECRET=sua_chave_jwt
JWT_EXPIRES_IN=3600
```

Rode a migration:

```bash
npx prisma migrate dev
```

Inicie o projeto:

```bash
pnpm run start:dev
```

## 🔐 Autenticação

Autenticação é feita via JWT. Após o login, use o token nos headers:

```
Authorization: Bearer <token>
```

Rotas como criação de usuário aceitam apenas, pois apenas adminstradores podem criar usuários `ApiKeyGuard` com:

```
x-api-key: <sua-chave>
```

## 📘 Endpoints Principais

### Auth

- `POST /auth/register` – Criação de usuário
- `POST /auth/login` – Login com JWT

### Account

- `POST /accounts` – Criação de conta bancária
- `PATCH /accounts/:id` – Atualização de conta
- `GET /accounts/user/:userId` – Consulta da conta por usuário

### Transactions

- `POST /transactions` – Criação de transação (depósito ou saque)
- `GET /transactions/account/:accountId` – Lista de transações da conta

## 🧠 Observações

- O saldo da conta é atualizado conforme as transações.
- Transações inválidas são registradas no histórico com status `FAILED` e motivo do erro.
- O sistema respeita o limite de crédito definido por conta.

---

Feito com 💻 por Lucas Quintino
