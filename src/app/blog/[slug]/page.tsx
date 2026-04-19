import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-light min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header del Artículo */}
          <div className="mb-12 border-b border-primario/10 pb-12">
            <Link 
              href="/blog" 
              className="text-acento font-barlow font-bold tracking-widest text-xs uppercase inline-flex items-center mb-8 hover:-translate-x-2 transition-transform"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al blog
            </Link>
            
            <div className="flex items-center space-x-3 mb-6">
               <span className="bg-acento/10 text-acento px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                 PROPUESTA 115
               </span>
               <span className="text-primario/20">•</span>
               <time className="text-primario/60 text-sm font-dmsans">
                 {new Date(post.metadata.date).toLocaleDateString('es-EC', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                 })}
               </time>
            </div>

            <h1 className="font-barlow text-5xl md:text-7xl font-bold text-primario tracking-tighter leading-[0.95] mb-8 uppercase">
              {post.metadata.title}
            </h1>

            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 rounded-full bg-primario flex items-center justify-center border-2 border-acento overflow-hidden">
                 <span className="text-acento font-barlow font-bold text-xl uppercase">JR</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-primario font-barlow font-bold text-lg tracking-tight leading-tight">
                   {post.metadata.author}
                 </span>
                 <span className="text-primario/40 text-xs tracking-widest uppercase font-bold">
                   Candidato a Alcalde
                 </span>
               </div>
            </div>
          </div>

          {/* Contenido MDX */}
          <div className="prose prose-xl prose-primario max-w-none font-dmsans leading-relaxed prose-headings:font-barlow prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-primario prose-p:text-primario/80 prose-strong:text-acento prose-a:text-acento prose-li:text-primario/70">
            <MDXRemote source={post.content} />
          </div>

          {/* Footer del Artículo - CTA Psicológico */}
          <div className="mt-20 pt-12 border-t border-primario/10">
             <div className="bg-primario p-10 md:p-14 text-white rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                </div>
                <span className="text-acento font-barlow tracking-widest text-xs font-bold uppercase mb-4 block">
                  DEFENDAMOS A LOJA ❤️
                </span>
                <h3 className="font-barlow text-4xl md:text-5xl font-extrabold mb-6 uppercase tracking-tighter leading-tight">
                  NO DEJES QUE TE <span className="text-acento">MIENTAN</span>.
                </h3>
                <p className="text-white/80 mb-10 max-w-2xl font-dmsans text-lg leading-relaxed">
                  Quienes gobernaron y fracasaron querrán decirte que estas soluciones son imposibles. Comparte esta verdad y dale a tu familia y amigos los argumentos para defender el futuro de nuestra ciudad.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="https://api.whatsapp.com/send?text=Mira%20la%20verdad%20sobre%20lo%20que%20propone%20Jorge%20Reyes%20para%20Loja.%20No%20dejes%20que%20te%20mientan:%20https://jorgereyesloja.ec" 
                    target="_blank"
                    className="bg-[#25D366] text-white font-barlow font-bold tracking-widest px-8 py-4 text-center rounded-sm transition-transform hover:scale-105 flex justify-center items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.77zm3.192 8.163c-.156.438-.813.821-1.15.864-.313.04-.632.121-1.921-.409-1.554-.641-2.56-2.227-2.637-2.33-.078-.104-.627-.834-.627-1.59 0-.756.391-1.127.53-1.282.138-.156.3-.195.4-.195.101 0 .2.001.289.006.094.004.22-.036.343.26.13.31.442 1.077.48 1.156.04.078.065.17.013.273-.052.104-.078.17-.156.26-.078.092-.167.202-.234.28-.078.09-.161.187-.07.343.091.155.405.669.873 1.085.602.535 1.107.7 1.263.78.156.078.247.065.342-.04.091-.104.391-.455.494-.61.104-.156.208-.13.344-.078.134.052.846.398.991.472.144.073.24.11.275.17.035.06.035.348-.121.786zM12 2C6.477 2 2 6.477 2 12c0 1.761.455 3.407 1.258 4.845L2 22l5.321-1.189A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                    COMPARTE EN WHATSAPP
                  </Link>
                  <Link 
                    href="/plan-2026" 
                    className="bg-transparent border-2 border-white/20 text-white font-barlow font-bold tracking-widest px-8 py-4 text-center rounded-sm transition-all hover:bg-white hover:text-primario"
                  >
                    VER EL PLAN 2026
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </div>
    </article>
  );
}
