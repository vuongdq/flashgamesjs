import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryGames, setCategoryGames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
      
      // Fetch games for each category
      const gamesData = {};
      for (const category of data) {
        const gamesRes = await fetch(`/api/categories/${category._id}/games`);
        const games = await gamesRes.json();
        gamesData[category._id] = games;
      }
      setCategoryGames(gamesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-48 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Game Categories</h1>
        
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {category.name}
              </h2>
              
              {categoryGames[category._id]?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryGames[category._id].map((game) => (
                    <Link
                      key={game._id}
                      href={`/game/${game.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative aspect-video">
                          <Image
                            src={game.thumbnail}
                            alt={game.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {game.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {game.playCount} plays
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No games in this category yet
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 