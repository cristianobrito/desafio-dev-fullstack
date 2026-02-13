"use client";

import { useState } from "react";

export default function SimularPage() {
  const [form, setForm] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      setMessage("Envie pelo menos uma conta de energia.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const unidades: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const response = await fetch(
          "https://magic-pdf.solarium.newsun.energy/v1/magic-pdf",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao processar PDF");
        }

        const decoded = await response.json();

        // 🔥 Garantindo exatamente 12 meses
        const historico = decoded.invoice
          ?.slice(0, 12)
          .map((item: any) => ({
            consumoForaPontaEmKWH: item.consumo_fp,
            mesDoConsumo: item.consumo_date,
          })) || [];

        if (historico.length !== 12) {
          throw new Error(
            "O PDF precisa conter exatamente 12 meses de consumo."
          );
        }

        unidades.push({
          codigoDaUnidadeConsumidora: decoded.unit_key,
          modeloFasico: decoded.phaseModel,
          enquadramento: decoded.chargingModel,
          historicoDeConsumoEmKWH: historico,
        });
      }

      // 🔥 Enviar para backend
      const backendResponse = await fetch(
        "http://localhost:3001/simulacoes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            unidades,
          }),
        }
      );

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || "Erro ao salvar simulação.");
      }

      setMessage("Simulação registrada com sucesso!");

      // Limpa formulário
      setForm({
        nomeCompleto: "",
        email: "",
        telefone: "",
      });

    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Erro ao registrar simulação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Nova Simulação
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="nomeCompleto"
          placeholder="Nome completo"
          value={form.nomeCompleto}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Processando..." : "Simular"}
        </button>

        {message && (
          <p className="text-sm mt-2">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
