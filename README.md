# Buildora API Documentation

Aplicação Angular criada para documentar toda a API Buildora/Obrax e permitir testes reais dos endpoints publicados.

## Objetivo

O projeto possui duas frentes principais:

- explicar o papel de cada aplicação do ecossistema Buildora
- documentar e testar a API inteira, no estilo playground/Swagger

## Estrutura da aplicação

### 1. Aplicações

Explica o papel de:

- API Buildora
- web de administração
- web do cliente
- app de campo
- banco master
- banco por empresa

### 2. Documentação da API

Inclui:

- catálogo de rotas
- organização por domínio
- query params por fluxo
- payloads obrigatórios e opcionais
- exemplos de body
- exemplos de resposta
- playground para testar endpoints diretamente

## Presets de teste

O playground já nasce preparado com:

- `X-Account-Code: buildora001`
- login master padrão
- login tenant da empresa de teste

## Stack

- Angular 21
- SCSS
- HttpClient
- catálogo dinâmico consumindo a própria API pública
- deploy preparado para Railway

## Desenvolvimento local

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

Saída:

- `dist/buildora-api-documentation/browser`

## Deploy no Railway

O projeto já está preparado com:

- `Dockerfile` multi-stage
- `nginx.conf.template`
- suporte ao `PORT` injetado pelo Railway
- fallback SPA para `index.html`

Fluxo sugerido:

1. subir este repositório para o GitHub
2. criar `New Project` no Railway
3. escolher `Deploy from GitHub repo`
4. selecionar `documentation_api_buildora`
5. gerar domínio em `Settings -> Networking`

## API alvo

Por padrão, a documentação aponta para:

- `https://web-production-1d13c.up.railway.app/api/v1/`

Se necessário, ajuste em:

- `src/app/resources.ts`
