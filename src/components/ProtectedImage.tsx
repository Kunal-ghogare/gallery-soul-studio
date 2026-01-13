import { useState } from 'react';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermarkText?: string;
}

/**
 * Shutterstock-style protected image component
 * - CSS-based diagonal watermark overlay (no CORS issues)
 * - Blocks right-click, drag, save
 * - Prevents direct image URL access
 */
export function ProtectedImage({
  src,
  alt,
  className = '',
  watermarkText = 'SOUL STUDIO',
}: ProtectedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate repeating watermark pattern for CSS
  const watermarkStyle = {
    backgroundImage: `repeating-linear-gradient(
      -30deg,
      transparent,
      transparent 80px,
      rgba(255, 255, 255, 0.03) 80px,
      rgba(255, 255, 255, 0.03) 82px
    )`,
  };

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center z-10">
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}

      {/* The actual image - no crossOrigin needed, avoids CORS */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover pointer-events-none ${isLoading || error ? 'invisible' : ''}`}
        draggable={false}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        // Prevent saving via long-press on mobile
        onTouchStart={(e) => e.preventDefault()}
      />

      {/* Watermark overlay with diagonal text pattern */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={watermarkStyle}
        aria-hidden="true"
      >
        {/* SVG-based repeating watermark text */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <pattern
              id="watermark-pattern"
              patternUnits="userSpaceOnUse"
              width="200"
              height="150"
              patternTransform="rotate(-30)"
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255, 255, 255, 0.15)"
                stroke="rgba(0, 0, 0, 0.05)"
                strokeWidth="0.5"
                fontSize="18"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
              >
                {watermarkText}
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#watermark-pattern)" />
        </svg>
      </div>

      {/* Invisible overlay to block all interactions */}
      <div
        className="absolute inset-0 z-20"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ cursor: 'default' }}
      />
    </div>
  );
}
