import Link from 'next/link';
import Image from 'next/image';

export default function GameCard({ game }) {
  const gameUrl = `/game/${game.slug || game._id}`;

  return (
    <Link 
      href={`/game/${game.slug}`}
      className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-video">
        <picture>
          {/* Small devices */}
          <source
            media="(max-width: 640px)"
            srcSet={game.thumbnails?.small || game.thumbnail}
          />
          {/* Medium devices */}
          <source
            media="(max-width: 1024px)"
            srcSet={game.thumbnails?.medium || game.thumbnail}
          />
          {/* Large devices */}
          <source
            srcSet={game.thumbnails?.large || game.thumbnail}
          />
          <Image
            src={game.thumbnail || game.thumbnails?.medium || '/placeholder.jpg'}
            alt={game.title}
            fill
            className="object-cover"
          />
        </picture>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {game.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {game.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {game.category?.name}
          </span>
          <span className="text-sm text-gray-500">
            {game.playCount} plays
          </span>
        </div>
      </div>
    </Link>
  );
} 