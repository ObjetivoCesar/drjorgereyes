import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin CMS | Jorge Reyes Loja 2026',
  description: 'Panel de administración de contenidos',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primario text-white px-6 py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-barlow text-2xl font-bold tracking-tight">CMS ADMIN</h1>
            <p className="text-white/60 text-sm font-dmsans">Gestión de contenidos - Jorge Reyes 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-white/80 hover:text-white text-sm font-dmsans flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver sitio
            </a>
            <a href="/blog" className="text-white/80 hover:text-white text-sm font-dmsans">Blog</a>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}