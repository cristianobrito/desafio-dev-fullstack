import Link from "next/link";
import Image from "next/image";
import profilePic from '@/public/2026-02-19-newsun-banner.png';

export default function Home() {
  return (
    <main style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      gap: "10px"
    }}>
      <h1 className="text-3xl font-semibold">NewSun Energy</h1>
      <div style={{position: 'relative', width: '100%', height: '70vh' }}>
          <Image
            src={profilePic}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            alt="newsun-banner"     
          />
      </div>
      <p className="text-gray-500">Click no botão para fazer uma simulação.</p>

      <Link href="/simular" className="px-6 py-3 rounded-md bg-[#2ecc71] text-white font-medium transition duration-200 hover:bg-[#4b5320] hover:-translate-y-0.5">
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
