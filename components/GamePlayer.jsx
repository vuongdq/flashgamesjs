import { useEffect, useRef } from 'react';

export default function GamePlayer({ swfUrl, error }) {
  const containerRef = useRef(null);
  const ruffleRef = useRef(null);

  useEffect(() => {
    if (!swfUrl || error) return;

    const loadRuffle = async () => {
      if (typeof window !== 'undefined' && window.RufflePlayer) {
        try {
          // Cleanup old player if exists
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          // Configure Ruffle
          window.RufflePlayer.config = {
            autoplay: 'on',
            unmuteOverlay: 'hidden',
            backgroundColor: '#000000',
            letterbox: 'on',
            warnOnUnsupportedContent: false,
            contextMenu: true,
            showSwfDownload: false,
            upgradeToHttps: true,
            quality: 'high',
            scale: 'showAll',
          };

          // Create new player
          const ruffle = window.RufflePlayer.newest();
          const player = ruffle.createPlayer();
          
          // Set player dimensions
          player.style.width = '100%';
          player.style.height = '100%';
          
          // Add player to container
          containerRef.current.appendChild(player);
          
          // Load the game
          await player.load(swfUrl);
          
          // Store reference for cleanup
          ruffleRef.current = player;
        } catch (error) {
          console.error('Error loading Ruffle player:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-75">
                <div class="text-center">
                  <p class="mb-2">Error loading game</p>
                  <p class="text-sm text-gray-400">${error.message}</p>
                </div>
              </div>
            `;
          }
        }
      }
    };

    loadRuffle();

    return () => {
      if (ruffleRef.current) {
        try {
          ruffleRef.current.remove();
          ruffleRef.current = null;
        } catch (error) {
          console.error('Error cleaning up Ruffle player:', error);
        }
      }
    };
  }, [swfUrl, error]);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-black min-h-[400px] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl font-semibold mb-2">Game Not Available</p>
          <p className="text-gray-400">This game is currently unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black min-h-[400px]">
      <div ref={containerRef} className="absolute inset-0">
        {!swfUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <p>Loading game...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 