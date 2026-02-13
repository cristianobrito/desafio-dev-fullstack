"use client";

import { useEffect, useState } from "react";

interface Unidade {
  id: string;
  codigoDaUnidadeConsumidora: string;
}

interface Simulacao {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  unidades: Unidade[];
}

export default function ListagemPage() {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarSimulacoes = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filtroNome)
        params.append("nomeCompleto", filtroNome);

      if (filtroEmail)
        params.append("email", filtroEmail);

      if (filtroCodigo)
        params.append(
          "codigoDaUnidadeConsumidora",
          filtroCodigo
        );

      const response = await fetch(
        `http://localhost:3001/simulacoes?${params.toString()}`
      );

      const data = await response.json();
      setSimulacoes(data);
    } catch (error) {
      console.error("Erro ao buscar simulações:", error);
      setSimulacoes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarSimulacoes();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Listagem de Simulações
      </h1>

      {/* Filtros */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Filtrar por email"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Filtrar por código da unidade"
          value={filtroCodigo}
          onChange={(e) => setFiltroCodigo(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={buscarSimulacoes}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {/* Lista */}
      <div className="space-y-4">
        {!loading && simulacoes.length === 0 && (
          <p>Nenhuma simulação encontrada.</p>
        )}

        {simulacoes.map((simulacao) => (
          <div
            key={simulacao.id}
            className="border p-4 rounded shadow-sm"
          >
            <p><strong>Nome:</strong> {simulacao.nomeCompleto}</p>
            <p><strong>Email:</strong> {simulacao.email}</p>
            <p><strong>Telefone:</strong> {simulacao.telefone}</p>

            <div className="mt-2">
              <strong>Unidades:</strong>
              <ul className="list-disc ml-6">
                {simulacao.unidades.map((unidade) => (
                  <li key={unidade.id}>
                    {unidade.codigoDaUnidadeConsumidora}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
