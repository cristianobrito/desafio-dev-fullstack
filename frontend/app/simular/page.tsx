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

    const formData = new FormData();

    formData.append("nomeCompleto", form.nomeCompleto);
    formData.append("email", form.email);
    formData.append("telefone", form.telefone);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // IMPORTANTÍSSIMO
    }

    const response = await fetch(
      "http://localhost:3001/simulacoes",
      {
        method: "POST",
        body: formData,
      }
    );

    // vamos debuggar

    if (!response.ok) {
  const errorData = await response.json();
  console.log("Erro completo backend:", errorData);
  alert(JSON.stringify(errorData));
  return;
}

    setMessage("Simulação registrada com sucesso!");

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
