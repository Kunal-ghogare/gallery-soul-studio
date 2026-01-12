import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbox } from './Lightbox';
import { ALBUMS } from '@/lib/googleDrive';

import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import portfolio5 from '@/assets/portfolio-5.jpg';
import portfolio6 from '@/assets/portfolio-6.jpg';

const photoMap: Record<string, string> = {
  'portfolio-1': portfolio1,
  'portfolio-2': portfolio2,
  'portfolio-3': portfolio3,
  'portfolio-4': portfolio4,
  'portfolio-5': portfolio5,
  'portfolio-6': portfolio6,
};

interface Photo {
  id: string;
  title: string;
  category: string;
  description?: string;
  location?: string;
  date?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  src: string;
}

// Sample photos using your album categories
// Replace these with your actual Google Drive file URLs using makePhoto()
const photos: Photo[] = [
  {
    id: '1',
    title: 'Bride Portrait',
    category: 'weddings',
    description: 'Beautiful bridal moment',
    location: 'Studio',
    date: '2024',
    aspectRatio: 'square',
    src: 'portfolio-1',
  },
  {
    id: '2',
    title: 'Runway Walk',
    category: 'fashion-show',
    description: 'Fashion week highlight',
    location: 'Mumbai',
    date: '2024',
    aspectRatio: 'portrait',
    src: 'portfolio-2',
  },
  {
    id: '3',
    title: 'Candid Moment',
    category: 'candids',
    description: 'Spontaneous capture',
    location: 'Delhi',
    date: '2023',
    aspectRatio: 'landscape',
    src: 'portfolio-3',
  },
  {
    id: '4',
    title: 'Stage Drama',
    category: 'theatre-drama',
    description: 'Theatrical performance',
    location: 'Theatre',
    date: '2024',
    aspectRatio: 'square',
    src: 'portfolio-4',
  },
  {
    id: '5',
    title: 'Portrait Study',
    category: 'portraits',
    description: 'Expressive portrait',
    location: 'Studio',
    date: '2024',
    aspectRatio: 'landscape',
    src: 'portfolio-5',
  },
  {
    id: '6',
    title: 'Bharatanatyam',
    category: 'classical-dance',
    description: 'Classical dance performance',
    location: 'Auditorium',
    date: '2023',
    aspectRatio: 'portrait',
    src: 'portfolio-6',
  },
];

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
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredPhotos = photos
    .filter((photo) => activeCategory === 'all' || photo.category === activeCategory)
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

  return (
    <>
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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
            className={`group cursor-pointer ${
              photo.aspectRatio === 'portrait' ? 'md:row-span-2' : ''
            } ${photo.aspectRatio === 'landscape' ? 'md:col-span-2 lg:col-span-1' : ''}`}
            onClick={() => handlePhotoClick(photo, index)}
          >
            <div className="relative overflow-hidden bg-muted aspect-square">
              <img
                src={photoMap[photo.src] || photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover image-hover"
              />
              <div className="absolute inset-0 bg-gallery-overlay/0 group-hover:bg-gallery-overlay/40 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="font-display text-xl text-gallery-text mb-1">
                  {photo.title}
                </h3>
                <p className="text-sm text-gallery-text/70 tracking-wide uppercase">
                  {photo.location}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {selectedPhoto && (
        <Lightbox
          photo={{
            ...selectedPhoto,
            src: photoMap[selectedPhoto.src] || selectedPhoto.src,
          }}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={handleNavigate}
          hasNext={filteredPhotos.length > 1}
          hasPrev={filteredPhotos.length > 1}
        />
      )}
    </>
  );
}
