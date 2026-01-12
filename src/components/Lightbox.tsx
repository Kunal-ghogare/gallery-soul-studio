import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Camera } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  category: string;
  description?: string;
  location?: string;
  date?: string;
  camera?: string;
  src: string;
}

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Lightbox({ photo, onClose, onNavigate, hasNext, hasPrev }: LightboxProps) {
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
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
          className="absolute top-6 right-6 z-10 p-2 text-gallery-text/70 hover:text-gallery-text transition-colors"
          aria-label="Close lightbox"
        >
          <X size={28} strokeWidth={1.5} />
        </button>

        {/* Navigation */}
        {hasPrev && (
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 md:left-8 z-10 p-3 text-gallery-text/70 hover:text-gallery-text transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={40} strokeWidth={1} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 md:right-8 z-10 p-3 text-gallery-text/70 hover:text-gallery-text transition-colors"
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
          className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-16"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={photo.src}
                alt={photo.title}
                className="max-h-[70vh] lg:max-h-[80vh] w-auto object-contain"
              />
            </div>

            {/* Info Panel */}
            <div className="lg:w-72 text-gallery-text text-center lg:text-left">
              <h2 className="font-display text-3xl mb-2">{photo.title}</h2>
              <p className="text-sm tracking-widest uppercase text-gallery-text/60 mb-6">
                {photo.category}
              </p>
              
              {photo.description && (
                <p className="text-gallery-text/80 mb-6 leading-relaxed">
                  {photo.description}
                </p>
              )}

              <div className="space-y-3 text-sm text-gallery-text/60">
                {photo.location && (
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <MapPin size={16} />
                    <span>{photo.location}</span>
                  </div>
                )}
                {photo.date && (
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <Calendar size={16} />
                    <span>{photo.date}</span>
                  </div>
                )}
                {photo.camera && (
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <Camera size={16} />
                    <span>{photo.camera}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
