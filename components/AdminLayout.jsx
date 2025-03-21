import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && router.pathname !== '/admin') {
      router.push('/admin');
    } else if (token) {
      // Decode JWT to get admin email
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminEmail(payload.email);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  if (router.pathname === '/admin') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/games" className="text-xl font-bold text-gray-800">
                Flash Games Admin
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link
                    href="/admin/games"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/admin/games'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Games
                  </Link>
                  <Link
                    href="/admin/categories"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/admin/categories'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/admin/users'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Users
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                {adminEmail}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/admin/games"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/admin/games'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Games
            </Link>
            <Link
              href="/admin/categories"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/admin/categories'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Categories
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 text-center text-sm text-gray-600">
          Flash Games Admin Panel &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
} 