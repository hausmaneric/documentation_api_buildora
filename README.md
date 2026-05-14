# Buildora API Documentation

Aplicação Angular para documentar toda a API Buildora/Obrax.

## Objetivo

O projeto possui duas frentes principais:

- explicar o papel de cada aplicação do ecossistema
- documentar e testar a API inteira, no estilo playground/Swagger

## Stack

- Angular 21
- SCSS
- HttpClient
- Syncfusion disponível no projeto-base
- Deploy preparado para Railway

## Abas da aplicação

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
- payloads obrigatórios e opcionais
- exemplos de body
- exemplos de resposta
- playground para testar endpoints diretamente

## Presets de teste

O playground já nasce preparado com:

- `X-Account-Code: buildora001`
- login master padrão
- login tenant da empresa de teste

## Desenvolvimento local

```bash
npm install
npm run start
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
- suporte ao `PORT` do Railway

Fluxo:

1. subir este repositório para o GitHub
2. criar `New Project` no Railway
3. escolher `Deploy from GitHub repo`
4. selecionar `documentation_api_buildora`
5. gerar domínio em `Settings -> Networking`

## API alvo

Por padrão a documentação aponta para:

- `https://web-production-1d13c.up.railway.app/api/v1/`

Se necessário, ajuste em:

- `src/app/resources.ts`
