"""
Google Drive Photo Fetcher for Gallery Soul Studio

This script fetches photo URLs from your Google Drive folders
and generates a photos.json file for the website.

Automatically discovers all subfolders (albums) from a parent folder.

Supports two authentication modes:
1. Service Account (for GitHub Actions) - set GOOGLE_SERVICE_ACCOUNT_KEY env var
2. OAuth (for local development) - uses client_secrets.json

Usage:
    # Local (OAuth):
    python scripts/fetch-photos.py

    # GitHub Actions (Service Account):
    GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' python scripts/fetch-photos.py

Environment Variables:
    GOOGLE_DRIVE_PARENT_FOLDER - The parent folder ID containing album subfolders

Requirements:
    pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
"""

import json
import os
import re
from datetime import datetime
from google.oauth2 import service_account
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import pickle

# If modifying these scopes, delete the token.pickle file
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# Output path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "..", "src", "data", "photos.json")
TOKEN_PATH = os.path.join(SCRIPT_DIR, "token.pickle")
CREDENTIALS_PATHS = [
    os.path.join(SCRIPT_DIR, "credentials.json"),
    os.path.join(SCRIPT_DIR, "..", "client_secrets.json"),
]


def get_parent_folder_id():
    """Get the parent folder ID from environment variable or .env file"""
    folder_id = os.environ.get('GOOGLE_DRIVE_PARENT_FOLDER')
    if folder_id:
        return folder_id

    # Fallback for local development - load from .env file
    env_path = os.path.join(SCRIPT_DIR, "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('GOOGLE_DRIVE_PARENT_FOLDER='):
                    folder_id = line.split('=', 1)[1].strip()
                    # Remove quotes if present
                    if folder_id.startswith("'") or folder_id.startswith('"'):
                        folder_id = folder_id[1:-1]
                    return folder_id

    print("ERROR: GOOGLE_DRIVE_PARENT_FOLDER environment variable not set!")
    print("Set it in .env file or as environment variable")
    return None


def extract_order_prefix(name: str) -> tuple:
    """Extract numeric prefix and clean name from a string.

    Examples:
        '01-Weddings' -> (1, 'Weddings')
        '02 - Portraits' -> (2, 'Portraits')
        '10_Classical Dance' -> (10, 'Classical Dance')
        'Candids' -> (float('inf'), 'Candids')  # No prefix = sort last

    Returns:
        (order_number, clean_name) - order_number is float('inf') if no prefix
    """
    # Match patterns like: "01-Name", "01 - Name", "01_Name", "01 Name"
    match = re.match(r'^(\d+)[\s\-_]+(.+)$', name)
    if match:
        order = int(match.group(1))
        clean_name = match.group(2).strip()
        return (order, clean_name)
    return (float('inf'), name)


def slugify(text: str) -> str:
    """Convert folder name to URL-friendly slug"""
    # First strip any order prefix
    _, clean_text = extract_order_prefix(text)
    # Convert to lowercase
    clean_text = clean_text.lower()
    # Replace spaces and special chars with hyphens
    clean_text = re.sub(r'[^\w\s-]', '', clean_text)
    clean_text = re.sub(r'[-\s]+', '-', clean_text)
    return clean_text.strip('-')


def get_image_url(file_id: str, thumbnail: bool = False, size: int = 800) -> str:
    """Generate Google Drive image URL from file ID

    Using lh3.googleusercontent.com format which is more reliable for embedding
    and doesn't have the same rate limiting issues as drive.google.com/thumbnail
    """
    # This format works better for direct embedding and has fewer rate limit issues
    return f"https://lh3.googleusercontent.com/d/{file_id}=w{size}"


def find_credentials_file():
    """Find the credentials file from multiple possible locations"""
    for path in CREDENTIALS_PATHS:
        if os.path.exists(path):
            return path
    return None


def authenticate_service_account():
    """Authenticate using Service Account (for GitHub Actions or local)"""
    # Try environment variable first (GitHub Actions)
    key_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY')
    if key_json:
        print("Using Service Account from environment variable...")
        key_data = json.loads(key_json)
        creds = service_account.Credentials.from_service_account_info(
            key_data, scopes=SCOPES
        )
        return build('drive', 'v3', credentials=creds)

    # Try local service account file
    service_account_paths = [
        os.path.join(SCRIPT_DIR, "service-account.json"),
        os.path.join(SCRIPT_DIR, "..", "maps-49f04-83bb3223da1f.json"),
    ]

    for sa_path in service_account_paths:
        if os.path.exists(sa_path):
            print(f"Using Service Account from: {sa_path}")
            creds = service_account.Credentials.from_service_account_file(
                sa_path, scopes=SCOPES
            )
            return build('drive', 'v3', credentials=creds)

    return None


def authenticate_oauth():
    """Authenticate using OAuth (for local development)"""
    creds = None

    # Check for existing token
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, 'rb') as token:
            creds = pickle.load(token)

    # If no valid credentials, let user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...")
            creds.refresh(Request())
        else:
            creds_file = find_credentials_file()
            if not creds_file:
                print("\n" + "="*60)
                print("ERROR: No credentials found!")
                print("="*60)
                print("\nFor local development:")
                print("  - Place client_secrets.json in project root")
                print("\nFor GitHub Actions:")
                print("  - Set GOOGLE_SERVICE_ACCOUNT_KEY secret")
                print("\n" + "="*60)
                return None

            print(f"Using credentials from: {creds_file}")
            print("Opening browser for Google authentication...")

            flow = InstalledAppFlow.from_client_secrets_file(creds_file, SCOPES)
            creds = flow.run_local_server(port=8080, open_browser=True)

        # Save the credentials for next run
        with open(TOKEN_PATH, 'wb') as token:
            pickle.dump(creds, token)
        print("Credentials saved for future use!")

    return build('drive', 'v3', credentials=creds)


def authenticate():
    """Authenticate with Google Drive API - tries Service Account first, then OAuth"""
    # Try Service Account first (for CI/CD)
    service = authenticate_service_account()
    if service:
        return service

    # Fall back to OAuth (for local development)
    return authenticate_oauth()


def get_subfolders(service, parent_folder_id: str, retries: int = 3) -> list:
    """Fetch all subfolders from a parent Google Drive folder"""
    query = f"'{parent_folder_id}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'"

    for attempt in range(retries):
        try:
            results = service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name)',
                pageSize=100,
                orderBy='name'
            ).execute()

            folders = results.get('files', [])
            break
        except Exception as e:
            if attempt < retries - 1:
                print(f"  Retry {attempt + 1}/{retries} after error: {e}")
                import time
                time.sleep(2)
            else:
                print(f"  Error fetching subfolders after {retries} attempts: {e}")
                return []

    # Convert to album format with ordering support
    albums = []
    for folder in folders:
        original_name = folder['name']
        order, clean_title = extract_order_prefix(original_name)
        albums.append({
            "id": slugify(original_name),
            "title": clean_title,  # Display name without prefix
            "folderId": folder['id'],
            "_order": order,  # Used for sorting, removed later
        })

    # Sort by order prefix (numbered first, then non-numbered)
    albums.sort(key=lambda x: x["_order"])

    # Remove the _order field (not needed in output)
    for album in albums:
        del album["_order"]

    return albums


def get_images_from_folder(service, folder_id: str, retries: int = 3) -> list:
    """Fetch all images from a Google Drive folder with retry logic"""
    query = f"'{folder_id}' in parents and trashed=false and mimeType contains 'image/'"

    for attempt in range(retries):
        try:
            results = service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name, mimeType)',
                pageSize=100
            ).execute()

            files = results.get('files', [])
            break
        except Exception as e:
            if attempt < retries - 1:
                print(f"  Retry {attempt + 1}/{retries} after error: {e}")
                import time
                time.sleep(2)  # Wait 2 seconds before retry
            else:
                print(f"  Error fetching folder after {retries} attempts: {e}")
                return []

    images = []
    for file in files:
        file_id = file['id']
        filename = file['name']

        # Check if this is a cover image (filename contains 'cover')
        is_cover = 'cover' in filename.lower()

        # Extract order prefix from filename
        order, _ = extract_order_prefix(filename)

        images.append({
            "id": file_id,
            "src": get_image_url(file_id),
            "thumbSrc": get_image_url(file_id, thumbnail=True, size=800),
            "isCover": is_cover,
            "_order": order,
        })

    # Sort: cover images first, then by order prefix, then by id
    images.sort(key=lambda x: (not x["isCover"], x["_order"], x["id"]))

    # Remove the _order field (not needed in output)
    for img in images:
        del img["_order"]

    return images


def fetch_all_photos(service, parent_folder_id: str) -> dict:
    """Fetch photos from all album folders discovered from the parent folder"""
    print(f"Discovering albums from parent folder...")

    # Discover all subfolders (albums) from the parent folder
    discovered_albums = get_subfolders(service, parent_folder_id)

    if not discovered_albums:
        print("No album folders found!")
        return {
            "albums": [],
            "photos": [],
            "lastUpdated": datetime.now().isoformat(),
            "totalPhotos": 0,
        }

    print(f"Found {len(discovered_albums)} albums:")
    for album in discovered_albums:
        print(f"  - {album['title']}")
    print()

    albums = []
    all_photos = []

    for album in discovered_albums:
        print(f"Fetching: {album['title']}...")

        images = get_images_from_folder(service, album["folderId"])

        # Add albumId to each photo
        for img in images:
            img["albumId"] = album["id"]
            all_photos.append(img)

        # Get cover photo (first image or one marked as cover)
        cover_photo = images[0] if images else None

        albums.append({
            "id": album["id"],
            "title": album["title"],
            "folderId": album["folderId"],
            "coverPhoto": cover_photo["thumbSrc"] if cover_photo else None,
            "photoCount": len(images),
        })

        print(f"  Found {len(images)} photos")

    return {
        "albums": albums,
        "photos": all_photos,
        "lastUpdated": datetime.now().isoformat(),
        "totalPhotos": len(all_photos),
    }


def main():
    print("=" * 50)
    print("Gallery Soul Studio - Photo Fetcher")
    print("=" * 50)
    print()

    # Get parent folder ID
    parent_folder_id = get_parent_folder_id()
    if not parent_folder_id:
        return

    print(f"Parent folder ID: {parent_folder_id}")
    print()

    # Authenticate
    print("Authenticating with Google Drive...")
    service = authenticate()

    if not service:
        return

    print("Authenticated successfully!")
    print()

    # Fetch photos
    data = fetch_all_photos(service, parent_folder_id)

    # Write to JSON
    output_path = os.path.normpath(OUTPUT_PATH)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print()
    print("=" * 50)
    print(f"Done! Fetched {data['totalPhotos']} photos from {len(data['albums'])} albums")
    print(f"Output: {output_path}")
    print("=" * 50)


if __name__ == "__main__":
    main()
