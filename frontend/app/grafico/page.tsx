import ContasEnergiaChart from '@/components/graficos/Contas-Energia-Chart'

export default function GraficoContaPage(){
    return(
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gráfico de Contas de Energia</h1>
      <ContasEnergiaChart />
    </div>
    )
}