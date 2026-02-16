🚀 Desafio Técnico – Plataforma de Simulação de Faturas de Energia

📌 Visão Geral

Aplicação fullstack desenvolvida para processar faturas de energia elétrica em PDF, extrair informações estruturadas via API externa e persistir os dados normalizados em banco relacional.

O sistema permite:

Upload de faturas

Processamento e validação dos dados decodificados

Persistência estruturada

Consulta com filtros dinâmicos

Recuperação detalhada por ID

🏗 Arquitetura
🔹 Backend

Node.js

Express

Prisma ORM

MySQL

Multer (upload)

Axios (integração externa)

Estrutura em Camadas
controllers/
services/
routes/
prisma/


Separação clara de responsabilidades:

Route → definição de endpoints

Controller → controle HTTP e status codes

Service → regras de negócio e integração externa

Prisma → persistência e modelagem

Essa abordagem mantém o domínio isolado da camada HTTP.

🔹 Frontend

Next.js (App Router)

React

Fetch API

Gerenciamento de estado local com hooks

Fluxo:

Upload de PDF

Envio via FormData

Consumo do backend

Renderização de listagem com filtros

🗂 Modelagem de Dados

A modelagem foi orientada ao domínio do problema.

Lead

Representa o cadastro principal do usuário.

Campo	        Tipo	        Observação
id	            UUID	        PK
nomeCompleto	String	        obrigatório
email	        String	        UNIQUE
telefone	    String	        obrigatório obs: **
createdAt	    DateTime	    default now
Unidade

Representa a unidade consumidora da fatura.

Campo	                    Tipo	Observação
id	                        UUID	PK
codigoDaUnidadeConsumidora	String	UNIQUE obs: **
modeloFasico	            String	
enquadramento	            String	
leadId	                            FK	relação com Lead
HistoricoDeConsumo

Representa os 12 meses obrigatórios de histórico.

Campo	                Tipo
id	                    UUID
consumoForaPontaEmKWH	Int
mesDoConsumo	        DateTime
unidadeId	            FK
🔐 Regras de Negócio Implementadas

✔ Um lead deve possuir pelo menos 1 unidade  obs: **
✔ Cada unidade deve conter exatamente 12 meses de histórico
✔ Email deve ser único
✔ Código da unidade deve ser único           obs: **
✔ Validações realizadas antes da persistência
✔ Tratamento explícito de erros

Erros retornam:

400 → erro de validação

404 → recurso não encontrado

🔌 Integração Externa

A aplicação envia o PDF para a API externa:

https://magic-pdf.solarium.newsun.energy/v1/magic-pdf


O fluxo é:

Recebimento do arquivo via Multer

Envio via Axios + FormData

Extração de:

invoice (histórico)

unit_key

phaseModel

chargingModel

Validação dos 12 meses

Persistência estruturada

A persistência não armazena o JSON bruto, mas apenas os dados relevantes ao domínio.

📡 Endpoints
POST /simulacoes

Cria um novo lead com unidades e histórico.

Regras aplicadas:

Validação de unicidade

Validação de quantidade de meses

GET /simulacoes

Permite filtros opcionais:

nomeCompleto (contains)

email (contains)

codigoDaUnidadeConsumidora (some relation)

GET /simulacoes/:id

Retorna estrutura completa com:

Lead

Unidades

Histórico

⚙ Estratégia de Integridade

Integridade garantida em dois níveis:

1️⃣ Banco de dados (constraints @unique)
2️⃣ Service (validação explícita antes da criação)

Essa abordagem evita inconsistência e falhas silenciosas.

📈 Possíveis Evoluções

Implementação de transações explícitas (Prisma transaction)

Paginação na listagem

Testes automatizados (Jest)

Logs estruturados

Versionamento de API

Armazenamento do PDF original em object storage

Autenticação e autorização

🐳 Execução
Subir containers
docker compose up -d

Rodar migrations
npx prisma migrate deploy

Backend
npm run dev

Frontend
npm run dev

🧠 Decisões Técnicas

Optado por normalização completa do domínio

Não armazenado JSON bruto da API externa

Uso de includes para garantir retorno agregado

Separação clara entre validação e persistência

Filtros dinâmicos montados condicionalmente

🏁 Conclusão

Foi muito legal desenvolver este projeto! Ele ficou com uma estrutura bem organizada.

Pensei em tudo pra ser:

📝 Fácil de entender - qualquer pessoa consegue se localizar no código

🔧 Tranquilo de manter - sem dor de cabeça quando precisar ajustar algo

🚀 Pronto pra crescer - se precisar adicionar mais funcionalidades, já está preparado

Fico feliz com o resultado e espero que curta usar e evoluir o projeto! 😊