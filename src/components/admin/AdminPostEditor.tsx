'use client';

import { useState, useEffect, useCallback } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';

type PostData = {
  slug?: string;
  metadata: {
    title?: string;
    date?: string;
    excerpt?: string;
    author?: string;
    category?: string;
    image?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
  };
  content: string;
};

type Props = {
  slug: string | null;
  onSave: () => void;
  onCancel: () => void;
};

const CATEGORIES = [
  'Artículo', 'Agua', 'Internet', 'Salud', 'Movilidad', 
  'Mercado', 'Educación', 'Liderazgo', 'Gobierno', 'Transparencia'
];

const DEFAULT_IMAGE = '/images/og-jorge-reyes.webp';

export default function AdminPostEditor({ slug, onSave, onCancel }: Props) {
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState<PostData['metadata']>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    author: 'Jorge Reyes',
    category: 'Artículo',
    image: DEFAULT_IMAGE,
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
  });

  const [content, setContent] = useState<string>('# Título del artículo\n\nEscribe tu contenido aquí...\n\n## Subtítulo\n\nTu propuesta aquí...');

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) throw new Error('Post not found');
      const data = await res.json();
      setForm(data.metadata);
      setContent(data.content);
    } catch {
      setError('Error cargando el artículo');
    } finally {
      setLoading(false);
    }
  };

  // Load existing post if editing
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleSave = async (publish = false) => {
    setSaving(true);
    setError(null);

    const statusToSave = publish ? 'published' : form.status;

    try {
      const payload = {
        title: form.title,
        content,
        metadata: { ...form, status: statusToSave },
      };

      const url = slug ? `/api/posts/${slug}` : '/api/posts';
      const method = slug ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error saving');

      onSave();
    } catch (err) {
      setError('Error guardando el artículo. Revisa que el servidor esté corriendo.');
    } finally {
      setSaving(false);
    }
  };

  const updateMeta = (key: keyof PostData['metadata'], value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primario border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-barlow text-3xl font-bold text-primario">
            {slug ? 'EDITAR ARTÍCULO' : 'NUEVO ARTÍCULO'}
          </h2>
          <p className="text-gray-500 font-dmsans">
            {slug ? `Editando: ${slug}` : 'Crea un nuevo artículo'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 font-dmsans hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-dmsans rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showPreview ? 'Ocultar preview' : 'Ver preview'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-2 bg-yellow-500 text-white font-barlow font-bold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar borrador'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-2 bg-green-500 text-white font-barlow font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-dmsans">
          {error}
        </div>
      )}

      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-barlow text-lg font-bold text-primario border-b pb-2">INFORMACIÓN BÁSICA</h3>
            
            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="Título del artículo"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.date || ''}
                  onChange={(e) => updateMeta('date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={form.category || 'Artículo'}
                  onChange={(e) => updateMeta('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Autor</label>
              <input
                type="text"
                value={form.author || ''}
                onChange={(e) => updateMeta('author', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Excerpt / Descripción corta</label>
              <textarea
                value={form.excerpt || ''}
                onChange={(e) => updateMeta('excerpt', e.target.value)}
                rows={2}
                placeholder="Breve descripción del artículo..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">URL de imagen destacada</label>
              <input
                type="text"
                value={form.image || ''}
                onChange={(e) => updateMeta('image', e.target.value)}
                placeholder="/images/og-jorge-reyes.webp"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-barlow text-lg font-bold text-primario border-b pb-2">SEO</h3>
            
            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">
                Meta Title <span className="text-gray-400">(60 caracteres max)</span>
              </label>
              <input
                type="text"
                value={form.seoTitle || ''}
                onChange={(e) => updateMeta('seoTitle', e.target.value)}
                maxLength={60}
                placeholder="Título para SEO (diferente al título visible)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">{form.seoTitle?.length || 0}/60</p>
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">
                Meta Description <span className="text-gray-400">(160 caracteres max)</span>
              </label>
              <textarea
                value={form.seoDescription || ''}
                onChange={(e) => updateMeta('seoDescription', e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="Descripción para buscadores..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.seoDescription?.length || 0}/160</p>
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">
                Palabras clave SEO <span className="text-gray-400">(separadas por coma)</span>
              </label>
              <input
                type="text"
                value={form.seoKeywords || ''}
                onChange={(e) => updateMeta('seoKeywords', e.target.value)}
                placeholder="loja 2026, elecciones, propuesta, ..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">OG Image URL</label>
              <input
                type="text"
                value={form.ogImage || ''}
                onChange={(e) => updateMeta('ogImage', e.target.value)}
                placeholder="Imagen para Open Graph (redes sociales)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-acento focus:border-transparent"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-barlow text-lg font-bold text-primario border-b pb-2">CONTENIDO MDX</h3>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-dmsans font-medium text-gray-700">Contenido del artículo</label>
                <span className="text-xs text-gray-400">Usa Markdown + componentes MDX</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                placeholder="# Título&#10;&#10;Contenido..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-acento focus:border-transparent resize-y"
              />
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p><strong>Tips MDX:</strong></p>
                <p>## Encabezado &nbsp;&nbsp; # Título principal</p>
                <p>**negrita** &nbsp;&nbsp; *cursiva* &nbsp;&nbsp; [enlace](url)</p>
                <p>- item &nbsp;&nbsp; 1. item numerado &nbsp;&nbsp; &gt; cita</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-6">
            <h3 className="font-barlow text-lg font-bold text-primario border-b pb-2 mb-4">PREVIEW</h3>
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}