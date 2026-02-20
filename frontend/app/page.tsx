// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Carousel } from '@/components/ui/Carousel';

// Importe todas as imagens que vão no carousel
import bannerPrincipal from '@/public/2026-02-19-newsun-banner.png';
import placasSolar from '@/public/2026-02-20-placas.png';
import employers from '@/public/2026-02-20-employers.png';
import grafics from '@/public/2026-02-20-grafics.png';
import economy from '@/public/2026-02-20-economy.png';
// Adicione mais se quiser:
// import outraImagem from '@/public/outra-imagem.jpg';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-8 p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-green-700">
        NewSun Energy
      </h1>

      {/* Carousel com várias fotos */}
      <Carousel>
      <div className="relative w-full h-[500px] md:h-[600px]">
        {/* Slide 1 */}
        <Image
          src={bannerPrincipal}
          alt="Painéis solares ao pôr do sol"
          width={1600}
          height={600}
          className="w-full h-[500px] md:h-[600px] object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-4">
            Newsun sempre com voce!
        </div>
      </div>

      <div className="relative w-full h-[500px] md:h-[600px]">
        {/* Slide 2 */}
        <Image
          src={placasSolar}
          alt="Instalação de placas solares"
          width={1600}
          height={600}
          className="w-full h-[500px] md:h-[600px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-4">
            Segurança e praticidade
        </div>
      </div>

      <div className="relative w-full h-[500px] md:h-[600px]">
        {/* Slide 3 */}
        <Image
          src={employers}
          alt="Equipe trabalhando em energia renovável"
          width={1600}
          height={600}
          className="w-full h-[500px] md:h-[600px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-4">
            Equipe profissional
        </div>

      </div>

        {/* Slide 4 - exemplo com texto sobre imagem (opcional) */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Image
            src={bannerPrincipal} // ou outra imagem de fundo
            alt="Fundo energia solar"
            fill
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-4">
            Energia limpa para um futuro melhor
          </div>
        </div>

        {/* Slide 5 - exemplo com texto sobre imagem (opcional) */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Image
            src={grafics} // ou outra imagem de fundo
            alt="resultados da economia"
            fill
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-4">
            Economia
          </div>
        </div>

        {/* Slide 6 - exemplo com texto sobre imagem (opcional) */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Image
            src={economy} // ou outra imagem de fundo
            alt="resultados da economia"
            fill
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-4">
            Benefícios
          </div>
        </div>

        {/* Adicione quantas quiser */}
        {/* <Image src={outraImagem} ... /> */}
      </Carousel>

      <p className="text-lg text-gray-400 text-center max-w-2xl">
        Click no botão para fazer uma simulação e veja como a energia solar pode reduzir sua conta de luz.
      </p>

      <Link href="/simular">
        <button className="px-10 py-5 rounded-xl bg-green-600 text-white font-bold text-xl shadow-lg hover:bg-green-700 transition-all transform hover:scale-105">
          Nova Simulação
        </button>
      </Link>
    </main>
  );
}