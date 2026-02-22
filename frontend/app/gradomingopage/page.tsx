import DomingoPage from '@/components/gradomingo/Gdomingo-teste';

async function getData(): Promise<Lead[]>{
    {/* pegando os dados da api */}
    const res = await fetch('http://localhost:3001/simulacoes', { cache: 'no-store' });

    {/* se a resposta não for ok */}
    if(!res.ok){
      throw new Error('Falha ao buscar simulações');
    }

    {/* espera converter o formato em json  */}
    const data = await res.json();
    { /* retorna os dados em um array json  */}
    return data;
}

export default async function DomingoP(){
    {/* esperando os dados estarem completos para usar */}
    const data = await getData();
    return(
        <div className="container mx-auto p-4">
          {/* passa os dados para o componente grafico */}
          <DomingoPage data={data} />
        </div>
    )
}