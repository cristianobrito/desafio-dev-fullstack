import Link from "next/link";

export default function Home() {
  return (
    <main style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      gap: "20px"
    }}>
      <h1 className="text-3xl font-semibold">NewSun Energy</h1>
      <p className="text-gray-500">Acesse /simular para realizar uma nova simulação.</p>

      <Link href="/simular" className="px-6 py-3 rounded-md bg-blue-700 text-white font-medium transition duration-200 hover:bg-blue-800 hover:-translate-y-0.5">
        <button style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}>
          Nova Simulação
        </button>
      </Link>
    </main>
  );
}
