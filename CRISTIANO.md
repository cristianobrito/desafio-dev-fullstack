# ENGENHARIA
### como criar um componente
  - criar uma pasta para todos os componentes `frontend/components`
  - a pasta vira rota na url `http://localhost:3000/segundaPage` 
  - para chamar `<Segunda />`
  - o componente deve ser importado `import Segunda2 from '@/components/segunda2/Segunda2'`
  - caminho das pastas `'@/components/segunda2/`
  - Segunda2: É o nome do arquivo (`Segunda2.tsx`).
  - import `Segunda2` como apelidei o componente dentro do arquivo atual 
  - export default posso apelidar até de batata
  - boa pratica usar o mesmo nome da função/arquivo
  - `'use client'` Precisa de espaço e é para interatividade.
  - `async` Só para componentes de servidor que buscam dados.

---
**flow**

```bash
[crio componente]--→[Segunda.tsx]
   |
[importo]----------→[import Segunda from '@/components/segunda/Segunda']
   |
[exibo]------------→[page.tsx <Segunda />]
   |             
[acesso url]-------→[http://localhost:3000/segundaPage]
```

frontend/components/segunda2/Segunda2.tsx
```bash
'use client'
export default function Segunda2()
{
    return(
        <h2>sou a segunda feira 2 eu não presto ola mundo!</h2>
    );
}
```
frontend/components/segunda2/Segunda2.tsx
```bash
import Segunda2 from '@/components/segunda2/Segunda2'

export default function S2feira()
{
    return(
        <div>
            <Segunda2 />
        </div>
    );
}
```