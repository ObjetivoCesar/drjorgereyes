import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export const metadata = {
  title: 'El Búnker de la Verdad y el Futuro | Jorge Reyes 2026',
  description: 'Munición para el seguidor: Argumentos técnicos, defensa histórica y conexión humana del Plan Loja 2026. Cómo participar política Loja, Movimiento MASS 115.',
  keywords: 'Cómo participar política Loja, Movimiento MASS 115 Loja qué es, verdad Mercado Mayorista Loja, propuestas Jorge Reyes',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Categories based on the strategic plan
  const categories = [
    { id: 'blindaje', name: 'La Verdad sobre lo que hicimos', icon: '🛡️' },
    { id: 'tecnico', name: 'Loja 2026: El Cómo', icon: '⚙️' },
    { id: 'humano', name: 'El Médico en tu Casa', icon: '🩺' },
  ];

  return (
    <div className="bg-light min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header - Bunker de la verdad */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block font-bold">
            MUNICIÓN PARA EL SEGUIDOR • GANA EL DEBATE
          </span>
          <h1 className="font-barlow text-6xl md:text-8xl font-black text-primario mb-6 tracking-tighter uppercase leading-[0.9]">
            EL BÚNKER DE LA <br/>
            <span className="text-acento">VERDAD</span> Y EL <span className="text-acento">FUTURO</span>
          </h1>
          <p className="text-xl text-primario/70 font-lora max-w-2xl mx-auto leading-relaxed italic">
            "Si dicen que no hicimos nada, muéstrales los hechos. Si dicen que nuestro plan es imposible, enséñales la ciencia."
          </p>
        </div>

        {/* Categories (Visual Guide - no real filtering yet unless needed, but serves as psychological anchor) */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => (
             <div key={cat.id} className="bg-white border border-primario/10 px-6 py-3 flex items-center space-x-3 shadow-sm">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-barlow font-bold text-primario tracking-widest uppercase text-xs">
                  {cat.name}
                </span>
             </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <article 
              key={post.slug}
              className="bg-white group overflow-hidden border-2 border-transparent hover:border-acento transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="p-10 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-6">
                      <span className="bg-acento text-primario px-3 py-1 font-barlow text-[10px] font-bold tracking-[0.2em] uppercase">
                        {post.metadata.category || 'REPORTE'}
                      </span>
                      <span className="text-primario/20 text-xs">•</span>
                      <time className="text-primario/40 text-xs font-dmsans">
                        {new Date(post.metadata.date).toLocaleDateString('es-EC', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </time>
                    </div>
                    {/* The problem/solution title */}
                    <h2 className="font-barlow text-4xl font-extrabold text-primario mb-4 group-hover:text-acento transition-colors leading-[1.1] uppercase tracking-tighter">
                      {post.metadata.title}
                    </h2>
                    {/* The problem context */}
                    <p className="text-primario/70 text-lg mb-8 line-clamp-3 font-dmsans">
                      {post.metadata.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-primario font-barlow font-bold tracking-widest text-sm uppercase group-hover:text-acento transition-colors">
                    Ver Evidencia 
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
