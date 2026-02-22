// components/graficos/Contas-Energia-Chart.tsx
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Tipos baseados nos dados reais da API
type HistoricoConsumo = {
  id: string;
  consumoForaPontaEmKWH: number;
  mesDoConsumo: string;
  unidadeId: string;
};

type Unidade = {
  id: string;
  codigoDaUnidadeConsumidora: string;
  modeloFasico: string;
  enquadramento: string;
  historicoDeConsumoEmKWH: HistoricoConsumo[];
};

type Simulacao = {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  createdAt: string;
  unidades: Unidade[];
};

// Cores para o gráfico de pizza
// No gráfico de pizza (atualize o array COLORS)
const COLORS = [
  'var(--chart-1)',  // Magenta
  'var(--chart-2)',  // Ciano
  'var(--chart-3)',  // Roxo
  'var(--chart-4)',  // Rosa-amarelo
  'var(--chart-5)',  // Magenta extra
];

export default function ContasEnergiaChart() {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('todas');

  useEffect(() => {
    buscarSimulacoes();
  }, []);

  const buscarSimulacoes = async () => {
    try {
      setLoading(true);
      // CORREÇÃO: Removido o /api/ da URL
      const response = await axios.get('http://localhost:3001/simulacoes');
      console.log('Dados recebidos:', response.data);
      setSimulacoes(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao buscar simulações');
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  // Preparar dados para o gráfico de linha (consumo ao longo do tempo)
  const prepararDadosLinha = () => {
    const dados: any[] = [];
    
    simulacoes.forEach(simulacao => {
      simulacao.unidades.forEach(unidade => {
        unidade.historicoDeConsumoEmKWH.forEach(historico => {
          dados.push({
            mes: new Date(historico.mesDoConsumo).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            consumo: historico.consumoForaPontaEmKWH,
            unidade: unidade.codigoDaUnidadeConsumidora,
            cliente: simulacao.nomeCompleto,
            dataCompleta: new Date(historico.mesDoConsumo).getTime()
          });
        });
      });
    });

    // Ordenar por data
    dados.sort((a, b) => a.dataCompleta - b.dataCompleta);
    
    // Se tiver muitas unidades, agrupar por mês (média)
    if (unidadeSelecionada === 'todas' && dados.length > 0) {
      const dadosAgrupados: any = {};
      dados.forEach(item => {
        if (!dadosAgrupados[item.mes]) {
          dadosAgrupados[item.mes] = {
            mes: item.mes,
            consumoTotal: 0,
            count: 0,
            dataCompleta: item.dataCompleta
          };
        }
        dadosAgrupados[item.mes].consumoTotal += item.consumo;
        dadosAgrupados[item.mes].count += 1;
      });

      return Object.values(dadosAgrupados).map((item: any) => ({
        mes: item.mes,
        consumo: Math.round(item.consumoTotal / item.count), // Média
        dataCompleta: item.dataCompleta
      })).sort((a, b) => a.dataCompleta - b.dataCompleta);
    }

    // Filtrar por unidade específica se selecionada
    if (unidadeSelecionada !== 'todas') {
      return dados
        .filter(item => item.unidade === unidadeSelecionada)
        .sort((a, b) => a.dataCompleta - b.dataCompleta);
    }

    return dados.sort((a, b) => a.dataCompleta - b.dataCompleta);
  };

  // Preparar dados para o gráfico de pizza (consumo por unidade)
  const prepararDadosPizza = () => {
    const consumoPorUnidade: any = {};
    
    simulacoes.forEach(simulacao => {
      simulacao.unidades.forEach(unidade => {
        const totalConsumo = unidade.historicoDeConsumoEmKWH.reduce(
          (acc, curr) => acc + curr.consumoForaPontaEmKWH, 0
        );
        consumoPorUnidade[unidade.codigoDaUnidadeConsumidora] = {
          nome: `${unidade.codigoDaUnidadeConsumidora} (${simulacao.nomeCompleto})`,
          consumo: totalConsumo
        };
      });
    });

    return Object.values(consumoPorUnidade);
  };

  // Preparar dados para o gráfico de barras (consumo por cliente)
  const prepararDadosBarras = () => {
    const consumoPorCliente: any = {};
    
    simulacoes.forEach(simulacao => {
      let totalCliente = 0;
      simulacao.unidades.forEach(unidade => {
        totalCliente += unidade.historicoDeConsumoEmKWH.reduce(
          (acc, curr) => acc + curr.consumoForaPontaEmKWH, 0
        );
      });
      if (totalCliente > 0) {
        consumoPorCliente[simulacao.nomeCompleto] = {
          cliente: simulacao.nomeCompleto,
          consumo: totalCliente
        };
      }
    });

    return Object.values(consumoPorCliente);
  };

  // Lista única de unidades para o filtro
  const unidades = Array.from(
    new Set(
      simulacoes.flatMap(s => 
        s.unidades.map(u => u.codigoDaUnidadeConsumidora)
      )
    )
  );

  const dadosLinha = prepararDadosLinha();
  const dadosPizza = prepararDadosPizza();
  const dadosBarras = prepararDadosBarras();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Carregando simulações...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Erro:</strong> {error}
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard de Consumo de Energia</h1>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-950/70 p-6 rounded-xl shadow-lg shadow-purple-500/20 backdrop-blur-sm border border-purple-500/10">
          <p className="text-sm text-blue-600 font-semibold">Total de Clientes</p>
          <p className="text-2xl font-bold">{simulacoes.length}</p>
        </div>
        <div className="bg-gray-950/70 p-6 rounded-xl shadow-lg shadow-purple-500/20 backdrop-blur-sm border border-purple-500/10">
          <p className="text-sm text-green-600 font-semibold">Total de Unidades</p>
          <p className="text-2xl font-bold">
            {simulacoes.reduce((acc, s) => acc + s.unidades.length, 0)}
          </p>
        </div>
        <div className="bg-gray-950/70 p-6 rounded-xl shadow-lg shadow-purple-500/20 backdrop-blur-sm border border-purple-500/10">
          <p className="text-sm text-purple-600 font-semibold">Consumo Total (kWh)</p>
          <p className="text-2xl font-bold">
            {dadosPizza.reduce((acc: number, item: any) => acc + item.consumo, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filtro de unidade */}
      {unidades.length > 0 && (
        <div className="flex items-center space-x-2">
          <label className="font-medium text-gray-700">Filtrar por unidade:</label>
          <select
            value={unidadeSelecionada}
            onChange={(e) => setUnidadeSelecionada(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas as unidades</option>
            {unidades.map(uc => (
              <option key={uc} value={uc}>{uc}</option>
            ))}
          </select>
        </div>
      )}

      {/* Gráfico de Linha - Evolução do consumo */}
      {dadosLinha.length > 0 && (
        <div className="bg-gray-950/80 p-6 rounded-xl shadow-2xl shadow-purple-500/30 backdrop-blur-sm border border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Evolução do Consumo Mensal</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosLinha} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumo" 
                stroke="var(--chart-1)"          // Magenta neon para a linha principal
                strokeWidth={3}                   // Aumente para mais glow
                dot={{ stroke: "var(--chart-1)", strokeWidth: 2, r: 5 }}  // Dots com glow
                name="Consumo (kWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráficos em grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Consumo por Unidade */}
        {dadosPizza.length > 0 && (
          <div className="bg-gray-950/80 p-6 rounded-xl shadow-2xl shadow-pink-500/30 backdrop-blur-sm border border-pink-500/20">
            <h2 className="text-xl font-semibold mb-4 text-pink-300">Consumo por Unidade</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.nome}: ${entry.consumo}kWh`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="consumo"
                  nameKey="nome"
                >
                  {dadosPizza.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico de Barras - Consumo por Cliente */}
        {dadosBarras.length > 0 && (
          <div className="bg-gray-950/80 p-6 rounded-xl shadow-2xl shadow-cyan-500/30 backdrop-blur-sm border border-cyan-500/20">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Consumo Total por Cliente</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosBarras} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cliente" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumo" fill="var(--chart-2)" radius={6} name="Consumo (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabela de detalhes */}
      <div className="bg-gray-950/80 p-6 rounded-xl shadow-2xl shadow-purple-500/30 backdrop-blur-sm border border-purple-500/20">
        <h2 className="text-xl font-semibold mb-4">Detalhamento das Simulações</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquadramento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {simulacoes.map(simulacao => 
                simulacao.unidades.map(unidade => {
                  const totalConsumo = unidade.historicoDeConsumoEmKWH.reduce(
                    (acc, curr) => acc + curr.consumoForaPontaEmKWH, 0
                  );
                  return (
                    <tr key={unidade.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{simulacao.nomeCompleto}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{unidade.codigoDaUnidadeConsumidora}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{unidade.modeloFasico}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{unidade.enquadramento}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{unidade.historicoDeConsumoEmKWH.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{totalConsumo.toLocaleString()} kWh</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}