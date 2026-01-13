import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbox } from './Lightbox';
import { ProtectedImage } from './ProtectedImage';
import { ALBUMS } from '@/lib/googleDrive';
import photosData from '@/data/photos.json';

interface Photo {
  id: string;
  albumId: string;
  src: string;
  thumbSrc: string;
}

// Use real photos from Drive
const photos: Photo[] = photosData.photos;

// Build categories from ALBUMS config
const categories = ['all', ...ALBUMS.map(album => album.id)];
const categoryLabels: Record<string, string> = {
  all: 'All',
  ...Object.fromEntries(ALBUMS.map(album => [album.id, album.title]))
};

interface PhotoGridProps {
  showFilters?: boolean;
  limit?: number;
}

export function PhotoGrid({ showFilters = true, limit }: PhotoGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Read album from URL on mount
  useEffect(() => {
    const albumParam = searchParams.get('album');
    if (albumParam && categories.includes(albumParam)) {
      setActiveCategory(albumParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('album');
    } else {
      searchParams.set('album', category);
    }
    setSearchParams(searchParams);
  };

  const filteredPhotos = photos
    .filter((photo) => activeCategory === 'all' || photo.albumId === activeCategory)
    .slice(0, limit);

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (selectedIndex + 1) % filteredPhotos.length;
    setSelectedIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  // Get album title for the current photo
  const getAlbumTitle = (albumId: string) => categoryLabels[albumId] || albumId;

  // Use thumbSrc for grid thumbnails
  const getGridThumbSrc = (photo: Photo) => photo.thumbSrc;

  return (
    <>
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 text-sm tracking-widest uppercase transition-all duration-300 ${
                activeCategory === category
                  ? 'text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {categoryLabels[category] || category}
            </button>
          ))}
        </div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {filteredPhotos.map((photo, index) => (
          <motion.article
            key={photo.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => handlePhotoClick(photo, index)}
          >
            <div className="relative overflow-hidden bg-muted aspect-square">
              <ProtectedImage
                src={getGridThumbSrc(photo)}
                alt={getAlbumTitle(photo.albumId)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gallery-overlay/0 group-hover:bg-gallery-overlay/40 transition-all duration-500 pointer-events-none" />
            </div>
          </motion.article>
        ))}
      </motion.div>

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={handleNavigate}
          hasNext={filteredPhotos.length > 1}
          hasPrev={filteredPhotos.length > 1}
        />
      )}
    </>
  );
}
