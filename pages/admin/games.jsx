import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import Image from 'next/image';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    hashtags: '',
    walkthroughVideo: '',
    status: 'active'
  });

  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const gamesRes = await fetch('/api/admin/games');
        if (!gamesRes.ok) throw new Error('Failed to fetch games');
        const gamesData = await gamesRes.json();
        
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();

        setGames(gamesData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleEdit = (game) => {
    setSelectedGame(game);
    setFormData({
      title: game.title,
      category: game.category?._id,
      shortDescription: game.shortDescription,
      longDescription: game.longDescription,
      hashtags: game.hashtags?.join(', '),
      walkthroughVideo: game.walkthroughVideo,
      status: game.status
    });
    setIsEditing(true);
    setEditingGame(game._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'hashtags') {
        formDataObj.append(key, formData[key].split(',').map(tag => tag.trim()));
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    const swfInput = document.querySelector('input[name="swf"]');
    const thumbnailInput = document.querySelector('input[name="thumbnail"]');
    const walkthroughImagesInput = document.querySelector('input[name="walkthroughImages"]');

    if (swfInput?.files[0]) formDataObj.append('swf', swfInput.files[0]);
    if (thumbnailInput?.files[0]) formDataObj.append('thumbnail', thumbnailInput.files[0]);
    
    if (walkthroughImagesInput?.files.length > 0) {
      Array.from(walkthroughImagesInput.files).forEach(file => {
        formDataObj.append('walkthroughImages', file);
      });
    }

    try {
      const url = editingGame 
        ? `/api/admin/games/${editingGame}`
        : '/api/admin/games';
      
      const method = editingGame ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataObj
      });

      if (res.ok) {
        fetchGames();
        setShowForm(false);
        setEditingGame(null);
        resetForm();
      } else {
        const error = await res.json();
        alert(error.message || 'Error saving game');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Error saving game');
    }
  };

  const handleDelete = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const res = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete game');

      setGames(games.filter(game => game._id !== gameId));
    } catch (err) {
      console.error('Error deleting game:', err);
      alert('Failed to delete game');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      shortDescription: '',
      longDescription: '',
      hashtags: '',
      walkthroughVideo: '',
      status: 'active'
    });
    setIsEditing(false);
    setSelectedGame(null);
    setEditingGame(null);
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-4">Loading...</div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="p-4 text-red-500">Error: {error}</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Games Management</h1>
            <button
              onClick={() => router.push('/admin/games/new')}
              className="btn btn-primary flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Game
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-800 truncate">
                        Total Games
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-blue-900">
                          {games.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-green-800 truncate">
                        Active Games
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-green-900">
                          {games.filter(game => game.status === 'active').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-yellow-800 truncate">
                        Total Plays
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-yellow-900">
                          {games.reduce((sum, game) => sum + game.playCount, 0)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Games Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Game</th>
                  <th className="table-header">Slug</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Plays</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {games.map(game => (
                  <tr key={game._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {game.thumbnails?.small && (
                            <div className="relative w-10 h-10">
                              <Image
                                src={game.thumbnails.small}
                                alt={game.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {game.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-500">
                        {game.slug}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {game.category?.name || 'No Category'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${
                        game.status === 'active' ? 'status-active' : 'status-inactive'
                      }`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="table-cell">{game.playCount}</td>
                    <td className="table-cell">
                      <div className="flex space-x-3">
                        <a
                          href={`/game/${game.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-action text-green-600 hover:text-green-900"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleEdit(game)}
                          className="table-action table-action-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(game._id)}
                          className="table-action table-action-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title={editingGame ? 'Edit Game' : 'Add New Game'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="form-input"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
                  <label className="form-label">SWF File {editingGame && '(Leave empty to keep current)'}</label>
              <input
                type="file"
                name="swf"
                accept=".swf"
                className="form-input"
                    required={!editingGame}
              />
            </div>

            <div>
                  <label className="form-label">Thumbnail {editingGame && '(Leave empty to keep current)'}</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                className="form-input"
                    required={!editingGame}
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Short Description</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                className="form-input"
                rows="2"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Long Description</label>
              <textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                className="form-input"
                rows="4"
              />
            </div>

            <div>
              <label className="form-label">Hashtags (comma separated)</label>
              <input
                type="text"
                value={formData.hashtags}
                onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                className="form-input"
                placeholder="action, adventure, platformer"
              />
            </div>

            <div>
              <label className="form-label">YouTube Walkthrough ID</label>
              <input
                type="text"
                value={formData.walkthroughVideo}
                onChange={(e) => setFormData({...formData, walkthroughVideo: e.target.value})}
                className="form-input"
                placeholder="e.g. dQw4w9WgXcQ"
              />
            </div>

            <div>
                  <label className="form-label">Walkthrough Images {editingGame && '(Leave empty to keep current)'}</label>
              <input
                type="file"
                name="walkthroughImages"
                accept="image/*"
                multiple
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4">
                {editingGame ? 'Update Game' : 'Add Game'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
} 