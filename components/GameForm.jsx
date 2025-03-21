import { useState, useEffect } from 'react';

export default function GameForm({ initialData, onSubmit, loading }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    category: '',
    status: 'draft',
    shortDescription: '',
    longDescription: '',
    hashtags: '',
  });

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value) form.append(key, value);
    }

    // Append files if they exist
    const gameFile = e.target.gameFile.files[0];
    const thumbnail = e.target.thumbnail.files[0];
    
    if (gameFile) form.append('gameFile', gameFile);
    if (thumbnail) form.append('thumbnail', thumbnail);

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Game File (SWF)</label>
          <input
            type="file"
            name="gameFile"
            accept=".swf"
            className="mt-1 block w-full"
            required={!initialData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            className="mt-1 block w-full"
            required={!initialData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Long Description</label>
          <textarea
            value={formData.longDescription}
            onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hashtags</label>
          <input
            type="text"
            value={formData.hashtags}
            onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
            placeholder="Enter hashtags separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Game'}
          </button>
        </div>
      </div>
    </form>
  );
} 