import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import GameForm from '../../../components/GameForm';

export default function NewGame() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      router.push('/admin/games');
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Add New Game</h1>
        <GameForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </AdminLayout>
  );
} 