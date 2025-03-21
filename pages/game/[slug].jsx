import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import GamePlayer from '../../components/GamePlayer';

export default function GameDetail() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGame = async (slug) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/game/${slug}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch game');
      }

      console.log('Game data:', data); // Debug log
      setGame(data);
    } catch (err) {
      console.error('Error fetching game:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const slug = window.location.pathname.split('/').pop();
    if (slug) {
      fetchGame(slug);
    }
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="aspect-video bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!game) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Game not found</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{game.title}</h1>
              {game.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {game.category.name}
                </span>
              )}
            </div>
            {game.shortDescription && (
              <p className="mt-2 text-gray-600">{game.shortDescription}</p>
            )}
          </div>

          <div className="aspect-video w-full bg-black">
            <GamePlayer 
              swfUrl={game.gameFile} 
              error={game.gameFileError}
            />
          </div>

          {game.longDescription && (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{game.longDescription}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 