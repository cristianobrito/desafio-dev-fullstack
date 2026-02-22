'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area 
} from 'recharts';

export default function Domingo({ data }: { data: any[] }) {
    
    // 1. TRANSFORMAÇÃO PARA BARRAS (Consumo Total por Lead)
    const dadosLeads = data.map(lead => {
        const consumoTotal = lead.unidades?.reduce((acc: number, uni: any) => {
            const somaUnidade = uni.historicoDeConsumoEmKWH?.reduce((s: number, h: any) => s + h.consumoForaPontaEmKWH, 0) || 0;
            return acc + somaUnidade;
        }, 0) || 0;

        return {
            nome: lead.nomeCompleto.split(' ')[0], 
            consumo: consumoTotal,
        };
    });

    // 2. TRANSFORMAÇÃO PARA EVOLUÇÃO MENSAL (Onda de Consumo)
    // Extraímos todos os meses de todos os leads para criar a linha do tempo
    const dadosMensais = data.flatMap(lead => 
        lead.unidades?.flatMap((unidade: any) => 
            unidade.historicoDeConsumoEmKWH?.map((h: any) => ({
                mes: new Date(h.mesDoConsumo).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                consumo: h.consumoForaPontaEmKWH,
                fullDate: new Date(h.mesDoConsumo)
            })) || []
        ) || []
    ).sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());

    const cores = { 
        cyan: "oklch(0.94 0.32 195)", 
        magenta: "oklch(0.92 0.35 320)" 
    };

    return (
        <div className="max-w-7xl mx-auto p-4 bg-[#121212] min-h-screen text-white font-sans">
            
            {/* FILTRO DE BRILHO NEON (Mágico) */}
            <svg width="0" height="0">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Gradiente para o gráfico de Área */}
                    <linearGradient id="gradMagenta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cores.magenta} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={cores.magenta} stopOpacity={0}/>
                    </linearGradient>
                </defs>
            </svg>

            <header className="mb-8">
                <h2 className="text-2xl font-bold tracking-tighter text-gray-400 uppercase italic">
                    <span className="text-cyan-400"></span> Painel de Monitoramento Domingo
                </h2>
            </header>

            {/* GRID RESPONSIVA: 1 coluna no celular, 2 colunas no PC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* CARD 1: CONSUMO POR LEAD */}
                <div className="rounded-2xl border border-white/5 p-6 bg-black/40 backdrop-blur-sm shadow-2xl">
                    <h3 className="text-cyan-400 font-mono mb-6 text-xs uppercase tracking-[0.2em]">
                        [01] Consumo Acumulado por Lead (kWh)
                    </h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={dadosLeads}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="nome" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: cores.cyan }}
                                />
                                <Bar 
                                    dataKey="consumo" 
                                    fill={cores.cyan} 
                                    style={{ filter: 'url(#glow)' }} 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CARD 2: EVOLUÇÃO MENSAL (ONDA NEON) */}
                <div className="rounded-2xl border border-white/5 p-6 bg-black/40 backdrop-blur-sm shadow-2xl">
                    <h3 className="text-magenta-400 font-mono mb-6 text-xs uppercase tracking-[0.2em]">
                        [02] Evolução do Consumo Mensal (Sazonal)
                    </h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <AreaChart data={dadosMensais}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="mes" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: cores.magenta }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="consumo" 
                                    stroke={cores.magenta} 
                                    strokeWidth={3}
                                    fill="url(#gradMagenta)"
                                    style={{ filter: 'url(#glow)' }} 
                                    dot={{ r: 3, fill: cores.magenta, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <footer className="mt-8 text-center text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                Sistema de Gerenciamento Energético Automático @2026
                <br />
                by: CRISTIANO OLIVEIRA
            </footer>
        </div>
    );
}