/**
 * Google Drive Portfolio Utility
 *
 * IMPORTANT:
 * - Folder links cannot be converted into direct image URLs without Drive API.
 * - This file sets up your site sections (albums) using your folder links.
 * - To show actual images, you must either:
 *   A) Add file links manually per photo, OR
 *   B) Use Google Drive API to list images inside each folder.
 */

// -----------------------------
// Google Drive ID Helpers
// -----------------------------

export function extractGoogleDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // file share URL
    /id=([a-zA-Z0-9_-]+)/,         // id query param
    /\/open\?id=([a-zA-Z0-9_-]+)/, // open format
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function extractGoogleDriveFolderId(url: string): string | null {
  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/, // folder URL
    /id=([a-zA-Z0-9_-]+)/,         // sometimes folder id is in query param
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getGoogleDriveImageUrl(fileShareUrl: string): string {
  const fileId = extractGoogleDriveFileId(fileShareUrl);
  if (!fileId) {
    console.warn("Could not extract FILE ID from Google Drive URL:", fileShareUrl);
    return fileShareUrl;
  }
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function getGoogleDriveThumbnailUrl(fileShareUrl: string, size: number = 800): string {
  const fileId = extractGoogleDriveFileId(fileShareUrl);
  if (!fileId) return fileShareUrl;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

// -----------------------------
// Album / Section Models
// -----------------------------

export interface Album {
  id: string;            // internal id (slug)
  title: string;         // display title
  folderUrl: string;     // your shared folder link
  folderId: string;      // extracted from folderUrl
  coverPhoto?: string;   // OPTIONAL: a file share link for cover image
  description?: string;
}

export const MAIN_DRIVE_FOLDER = {
  title: "FINAL PHOTOS",
  folderUrl: "https://drive.google.com/drive/folders/1My9pCM1VJq2efp2o-1UWqrsk8dQT4kQi?usp=sharing",
  folderId: extractGoogleDriveFolderId(
    "https://drive.google.com/drive/folders/1My9pCM1VJq2efp2o-1UWqrsk8dQT4kQi?usp=sharing"
  )!,
};

// ✅ Your folders become website sections automatically
export const ALBUMS: Album[] = [
  {
    id: "weddings",
    title: "Weddings",
    folderUrl: "https://drive.google.com/drive/folders/1JKUBwunRthgY4C1TrVXJ4OtBEFuBr3Mk?usp=sharing",
    folderId: extractGoogleDriveFolderId(
      "https://drive.google.com/drive/folders/1JKUBwunRthgY4C1TrVXJ4OtBEFuBr3Mk?usp=sharing"
    )!,
  },
  {
    id: "fashion-show",
    title: "Fashion Show",
    folderUrl: "https://drive.google.com/drive/folders/1XHRL9hjbo2FQhCtYbLiBhmvVDQLj3170?usp=sharing",
    folderId: extractGoogleDriveFolderId(
      "https://drive.google.com/drive/folders/1XHRL9hjbo2FQhCtYbLiBhmvVDQLj3170?usp=sharing"
    )!,
  },
  {
    id: "candids",
    title: "Candids",
    folderUrl: "https://drive.google.com/drive/folders/1yZ8mSWrWxQCfvMLjVeHMe2fL8Tn6VPe8?usp=drive_link",
    folderId: extractGoogleDriveFolderId(
      "https://drive.google.com/drive/folders/1yZ8mSWrWxQCfvMLjVeHMe2fL8Tn6VPe8?usp=drive_link"
    )!,
  },
  {
    id: "theatre-drama",
    title: "Theatre Drama",
    folderUrl: "https://drive.google.com/drive/folders/1oftaXUZj3VSZtDAPTigcCZ7c5nbgGeTa?usp=drive_link",
    folderId: extractGoogleDriveFolderId(
      "https://drive.google.com/drive/folders/1oftaXUZj3VSZtDAPTigcCZ7c5nbgGeTa?usp=drive_link"
    )!,
  },
  {
    id: "portraits",
    title: "Portraits",
    folderUrl: "https://drive.google.com/drive/folders/1jSQexFwkU66rElPzFoJ2QzZ21VBBNWIz?usp=drive_link",
    folderId: extractGoogleDriveFolderId(
      "https://drive.google.com/drive/folders/1jSQexFwkU66rElPzFoJ2QzZ21VBBNWIz?usp=drive_link"
    )!,
  },
  {
    id: "classical-dance",
    title: "Classical Dance",
    folderUrl: "https://drive.google.com/drive/folders/14n6x5O2jE06pqoL2AYDCorG1S5BxExNn?usp=drive_link",
    folderId: extractGoogleDriveFolderId(
      "https://drive.google.com/drive/folders/14n6x5O2jE06pqoL2AYDCorG1S5BxExNn?usp=drive_link"
    )!,
  },
];

// -----------------------------
// Photo Model
// -----------------------------

export interface Photo {
  id: string;
  title: string;
  albumId: Album["id"];
  driveFileUrl: string; // must be FILE url, not folder
  src: string;
  thumbSrc: string;
  description?: string;
  location?: string;
  date?: string;
}

export function makePhoto(p: Omit<Photo, "src" | "thumbSrc">): Photo {
  return {
    ...p,
    src: getGoogleDriveImageUrl(p.driveFileUrl),
    thumbSrc: getGoogleDriveThumbnailUrl(p.driveFileUrl, 800),
  };
}

/**
 * USAGE EXAMPLE:
 * 
 * To add photos, share individual files from Google Drive and use makePhoto():
 * 
 * const photos = [
 *   makePhoto({
 *     id: "w1",
 *     title: "Bride Entry",
 *     albumId: "weddings",
 *     driveFileUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing",
 *     description: "Beautiful entrance moment",
 *     location: "Mumbai",
 *     date: "2024"
 *   })
 * ];
 */
