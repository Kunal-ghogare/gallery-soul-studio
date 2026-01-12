/**
 * Google Drive Image Utility
 * 
 * HOW TO USE GOOGLE DRIVE IMAGES:
 * 
 * 1. Upload your images to Google Drive
 * 2. Right-click on an image → "Get link" → Set to "Anyone with the link"
 * 3. Copy the share link (it looks like: https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 * 4. Use this utility to convert it to a direct image URL
 * 
 * EXAMPLE:
 * const driveLink = "https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing";
 * const imageUrl = getGoogleDriveImageUrl(driveLink);
 * // Result: "https://drive.google.com/uc?export=view&id=1ABC123xyz"
 * 
 * LIMITATIONS:
 * - Google Drive has bandwidth limits for free accounts
 * - For high-traffic sites, consider using cloud storage (AWS S3, Cloudinary, etc.)
 * - Large files may load slowly
 */

export function extractGoogleDriveFileId(shareUrl: string): string | null {
  // Handle various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,           // Standard share URL
    /id=([a-zA-Z0-9_-]+)/,                   // Query param format
    /\/open\?id=([a-zA-Z0-9_-]+)/,           // Open URL format
  ];

  for (const pattern of patterns) {
    const match = shareUrl.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

export function getGoogleDriveImageUrl(shareUrl: string): string {
  const fileId = extractGoogleDriveFileId(shareUrl);
  
  if (!fileId) {
    console.warn('Could not extract file ID from Google Drive URL:', shareUrl);
    return shareUrl; // Return original if we can't parse it
  }
  
  // Direct embed URL - works for images
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function getGoogleDriveThumbnailUrl(shareUrl: string, size: number = 400): string {
  const fileId = extractGoogleDriveFileId(shareUrl);
  
  if (!fileId) {
    return shareUrl;
  }
  
  // Thumbnail URL with size parameter
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

// Example photo data structure for your portfolio
export interface Photo {
  id: string;
  title: string;
  category: 'landscape' | 'portrait' | 'architecture' | 'street' | 'nature' | 'abstract';
  description?: string;
  location?: string;
  date?: string;
  camera?: string;
  // You can use either a local import or Google Drive URL
  src: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

// Sample photos - replace with your Google Drive links
export const samplePhotos: Photo[] = [
  {
    id: '1',
    title: 'Solitary Oak',
    category: 'nature',
    description: 'A lone tree standing in the morning mist',
    location: 'Tuscany, Italy',
    date: '2024',
    aspectRatio: 'square',
    src: 'portfolio-1', // Will be replaced with actual import
  },
  {
    id: '2',
    title: 'Urban Solitude',
    category: 'street',
    description: 'Walking through city rain',
    location: 'Tokyo, Japan',
    date: '2024',
    aspectRatio: 'portrait',
    src: 'portfolio-2',
  },
  {
    id: '3',
    title: 'Eternal Waves',
    category: 'landscape',
    description: 'Long exposure seascape at dawn',
    location: 'Iceland',
    date: '2023',
    aspectRatio: 'landscape',
    src: 'portfolio-3',
  },
  {
    id: '4',
    title: 'Spiral',
    category: 'architecture',
    description: 'Abstract architectural study',
    location: 'Barcelona, Spain',
    date: '2024',
    aspectRatio: 'square',
    src: 'portfolio-4',
  },
  {
    id: '5',
    title: 'Memory',
    category: 'portrait',
    description: 'Hands that tell stories',
    location: 'Studio',
    date: '2024',
    aspectRatio: 'landscape',
    src: 'portfolio-5',
  },
  {
    id: '6',
    title: 'Dunes',
    category: 'landscape',
    description: 'Desert patterns at golden hour',
    location: 'Sahara, Morocco',
    date: '2023',
    aspectRatio: 'portrait',
    src: 'portfolio-6',
  },
];
