import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Flash Games</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                href="/categories"
                className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Categories
              </Link>
              <Link
                href="/popular"
                className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Popular
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 