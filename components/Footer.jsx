export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Flash Games</h3>
            <p className="text-gray-400">
              Your favorite Flash games collection, powered by Ruffle emulator.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-white">Categories</a></li>
              <li><a href="/popular" className="text-gray-400 hover:text-white">Popular Games</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-400">
              This website preserves Flash games using Ruffle emulator, allowing you to play classic Flash games in modern browsers.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Flash Games. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 