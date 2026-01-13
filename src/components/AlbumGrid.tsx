import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProtectedImage } from './ProtectedImage';
import photosData from '@/data/photos.json';

interface AlbumGridProps {
  limit?: number;
}

export function AlbumGrid({ limit }: AlbumGridProps) {
  const albums = limit ? photosData.albums.slice(0, limit) : photosData.albums;

  // Use smaller thumbnails for grid to reduce bandwidth
  const getSmallThumb = (url: string) => url?.replace('sz=w800', 'sz=w400');

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
    >
      {albums.map((album, index) => (
        <motion.article
          key={album.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <Link to={`/portfolio?album=${album.id}`}>
            <div className="relative overflow-hidden bg-muted aspect-square cursor-pointer">
              {album.coverPhoto ? (
                <ProtectedImage
                  src={getSmallThumb(album.coverPhoto)}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No cover</span>
                </div>
              )}
              {/* Dark gradient overlay - always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gallery-overlay/0 group-hover:bg-gallery-overlay/30 transition-all duration-500 pointer-events-none" />

              {/* Album title - always visible */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
                <h3 className="font-display text-2xl text-white">
                  {album.title}
                </h3>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </motion.div>
  );
}
