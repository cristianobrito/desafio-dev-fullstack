# CHANGELOG

## [2026-02-21 08:17]
- criei as pastas security, docs e logs
- criei o arquivo CHANGELOG.md

## [2026-02-21 08:20]
- criei a pasta STRUCTURE.md -> pasta que descreve a estrutura de pastas do projeto

## [2026-02-21 08:52]
- criei a branch para a pagina de graficos
    git checkout -b teste/teste-v4-graphics-page-implement

## [2026-02-21 08:59]
- instalei dentro da pasta frontend a lib para graficos
    npx shadcn-ui@latest init

## [2026-02-21 09:09]
- instalei a lib 
    npx shadcn@latest init
- com o pacote zinc

## [2026-02-21 09:14]
- instalei a biblioteca recharts dentro da pasta frontend
    npm install recharts

## [2026-02-21 09:18]
- instalei o shadcn ele tem ordem para instalar logo depois do recharts
    npx shadcn@latest add chart
- depois de instalar --buil no back pois instalei dependencias

## [2026-02-21 09:27]
- derrubei o container do backend e subi de novo com a opção --build
    docker compose down
    docker ps
    docker compose up -d --build
- derrubei e subi de novo o container do frontend
    ctrl + c 
    npm run dev
- fui conferir nas urls e nos packages.json e esta tudo ok
- backend urls
    http://localhost:3001/
    http://localhost:3001/simulacoes
- frontend urls
    http://localhost:3000/
    http://localhost:3000/simular

## [2026-02-21 09:42]
- criei a pasta graficos dentro da pasta /componentes
- criei o arquivo Contas-Energia-Chart.tsx dentro da pasta graficos
    caminho relativo frontend/components/graficos/Contas-Energia-Chart.tsx
    caminho absoluto /mnt/c/Users/brito/desktop/UCLivre/desafio-dev-fullstack/frontend/components/graficos/Contas-Energia-Chart.tsx

## [2026-02-21 09:54]
- movi a pasta graficos para dentro da pasta /app
- dentro da pasta graficos criei o arquivo page.tsx
    por convenção para ser pagina tem que ter esse nome
    path /mnt/c/Users/brito/desktop/UCLivre/desafio-dev-fullstack/frontend/app/graficos/page.tsx
    relative path frontend/app/graficos/page.tsx

## [2026-02-21 10:02]
- renomeei a pasta app/graficos para app/grafico
    path /mnt/c/Users/brito/desktop/UCLivre/desafio-dev-fullstack/frontend/app/grafico
    relativo frontend/app/grafico
- dentro dessa pasta app/grafico tem o arquivo page.tsx
    path /mnt/c/Users/brito/desktop/UCLivre/desafio-dev-fullstack/frontend/app/grafico/page.tsx
    relative frontend/app/grafico/page.tsx    
- criei a pasta graficos dentro da pasta componentes
    path /mnt/c/Users/brito/desktop/UCLivre/desafio-dev-fullstack/frontend/components/graficos
    relative frontend/components/graficos
- dentro da pasta components/graficos criei o arquivo Contas-Energia-Chart.tsx

## [2026-02-21 10:24]
- escrevi os arquivos do components/page.tsx e do app/graficos/Contas-Energia-Chart.tsx
- derrubei o front e o backend e voltei a subir cada um deles
- fui na url: http://localhost:3000/grafico e tudo rodou normalmente o componete foi exibido

## [2026-02-21 11:12]
- instalei o axios na pasta do frontend para resolver o erro
  o erro do axios ocorreu porque tive que ligar o front ao back para pegar os dados para usar no grafico
    npm install axios
- depois de instalar o axios derrubar e subir de novo o front e o backend
- conferir no package.json do frontend se o axios foi instalado e estava la
- tudo rodou normalmente exceto por uma warning na chamada await

## [2026-02-21 11:35]
- modifiquei o code do arquivo Contas-Energia-Chart.tsx
- testei tudo e funcionou grafico exibido sem erros e atualizando em tempo real

## [2026-02-21 12:08]
- modifiquei de novo o arquivo globals.css, Contas-Energia-Chart.tsx
- depois de derrubar e subir o front e o back tudo esta funcionando corretamente

****************************************************************************************

## [2026-02-22 08:13]
- mudei o fundo do template do grafico do arquivo Contas-Energia-Chart.tsx
-