import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ALBUMS } from '@/lib/googleDrive';

interface Photo {
  id: string;
  albumId: string;
  src: string;
  thumbSrc: string;
}

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasNext: boolean;
  hasPrev: boolean;
}

// Get album title from album id
const getAlbumTitle = (albumId: string) => {
  const album = ALBUMS.find(a => a.id === albumId);
  return album?.title || albumId.replace('-', ' ');
};

export function Lightbox({ photo, onClose, onNavigate, hasNext, hasPrev }: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate('prev');
      if (e.key === 'ArrowRight' && hasNext) onNavigate('next');
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNavigate, hasNext, hasPrev]);

  // Reset loading state when photo changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [photo.id]);

  const albumTitle = getAlbumTitle(photo.albumId);

  // Use thumbnail URL with larger size for lightbox (max ~2000px works reliably)
  const imageUrl = photo.thumbSrc.replace('sz=w800', 'sz=w2000');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gallery-overlay/95 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-gallery-text/70 hover:text-gallery-text transition-colors"
          aria-label="Close lightbox"
        >
          <X size={28} strokeWidth={1.5} />
        </button>

        {/* Navigation */}
        {hasPrev && (
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 md:left-8 z-20 p-3 text-gallery-text/70 hover:text-gallery-text transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={40} strokeWidth={1} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 md:right-8 z-20 p-3 text-gallery-text/70 hover:text-gallery-text transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={40} strokeWidth={1} />
          </button>
        )}

        {/* Content */}
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-5 flex flex-col items-center max-w-5xl mx-auto px-20"
        >
          {/* Album label at top */}
          <p className="text-sm tracking-widest uppercase text-gallery-text/60 mb-4">
            {albumTitle}
          </p>

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-gallery-text/60 text-sm">Loading...</div>
          )}

          {/* Error message */}
          {hasError && (
            <div className="text-red-400 text-sm">Failed to load image</div>
          )}

          {/* Image */}
          <img
            src={imageUrl}
            alt={albumTitle}
            className={`max-h-[80vh] max-w-full object-contain select-none ${isLoading ? 'hidden' : ''}`}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
