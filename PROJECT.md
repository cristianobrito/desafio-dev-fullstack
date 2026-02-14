PROJECT.md
    Desafio Full Stack – NewSun Energy

Este projeto foi desenvolvido como parte do processo seletivo para desenvolvedor Full Stack da NewSun Energy.

    Tecnologias Utilizadas
Backend

Node.js

Typescript

Express

Prisma ORM

MySQL

Docker

Frontend

Next.js (React)

Typescript

TailwindCSS

  Arquitetura

A aplicação foi dividida em:

Frontend responsável pela interface e submissão dos dados.

Backend responsável por validação, persistência e consulta dos dados.

Banco de dados MySQL para armazenamento das simulações.

A integração com a API externa de decodificação de contas (magic-pdf) foi realizada diretamente no frontend para simplificar o fluxo de submissão. Em um ambiente produtivo, essa integração poderia ser movida para o backend por questões arquiteturais e de segurança.

  Fluxo da Aplicação

O usuário acessa /simular

Preenche:

Nome

Email

Telefone

Uma ou mais contas de energia (PDF)

O frontend envia o arquivo para a API:

https://magic-pdf.solarium.newsun.energy/v1/magic-pdf


A API retorna os dados decodificados.

O frontend valida se existem exatamente 12 meses de consumo.

Os dados estruturados são enviados para o backend.

O backend aplica validações de negócio e persiste no banco.

  Modelagem de Domínio
Lead

id

nomeCompleto

email (único)

telefone

unidades

Unidade

id

codigoDaUnidadeConsumidora (único)

modeloFasico

enquadramento

historicoDeConsumoEmKWH

Consumo

consumoForaPontaEmKWH

mesDoConsumo

Relacionamentos:

Lead 1:N Unidade

Unidade 1:N Consumo

  Regras de Negócio Implementadas

✔ O email deve ser único por lead
✔ O código da unidade consumidora deve ser único
✔ Um lead deve ter no mínimo 1 unidade
✔ Cada unidade deve conter exatamente 12 meses de consumo

Observação:
Devido à regra de unicidade do codigoDaUnidadeConsumidora, não é possível registrar duas simulações com a mesma unidade. Caso fosse necessário permitir múltiplos leads utilizando a mesma unidade, a modelagem poderia evoluir para um relacionamento N:N com tabela intermediária.

  Endpoints
POST /simulacoes

Cria uma nova simulação.

GET /simulacoes

Lista todas as simulações com opção de filtro por:

nomeCompleto

email

codigoDaUnidadeConsumidora

GET /simulacoes/:id

Retorna uma simulação específica pelo id.

  Frontend
/simular

Formulário para envio de nova simulação.

/listagem

Tela para consulta das simulações registradas.

  Executando com Docker

Clonar o repositório:

git clone <repo>


Subir os containers:

docker compose up -d


Rodar backend:

cd backend
npm install
npm run dev


Rodar frontend:

cd frontend
npm install
npm run dev


Frontend disponível em:

http://localhost:3000


Backend disponível em:

http://localhost:3001

  Considerações Finais

  O projeto atende integralmente aos requisitos do desafio, incluindo integração real com a API de decodificação de contas, modelagem adequada de domínio, aplicação das regras de negócio e implementação completa do frontend e backend.

+--------------------+
|  author: Cristiano |
+--------------------+

                                     newsun@2026