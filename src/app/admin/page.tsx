'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPostEditor from '@/components/admin/AdminPostEditor';
import AdminPostList from '@/components/admin/AdminPostList';

type View = 'list' | 'editor' | 'new';

export default function AdminPage() {
  const [view, setView] = useState<View>('list');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleEdit = (slug: string) => {
    setEditingSlug(slug);
    setView('editor');
  };

  const handleNew = () => {
    setEditingSlug(null);
    setView('new');
  };

  const handleSave = () => {
    setView('list');
    setEditingSlug(null);
    setRefreshKey((k) => k + 1);
  };

  const handleCancel = () => {
    setView('list');
    setEditingSlug(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {view === 'list' && (
        <AdminPostList
          key={refreshKey}
          onEdit={handleEdit}
          onNew={handleNew}
        />
      )}

      {(view === 'editor' || view === 'new') && (
        <AdminPostEditor
          slug={editingSlug}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}