// Helper to normalize Google Drive share links into direct viewable URLs
export function normalizeDriveLink(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  try {
    // If it's already a direct image host or Google image URL, return as-is
    if (/drive\.google\.com\/thumbnail\?/.test(trimmed) || /^(https:\/\/)?lh3\.googleusercontent\.com\//.test(trimmed)) {
      return trimmed;
    }

    // Use the URL API when possible to parse query params reliably
    let parsed: URL | null = null;
    try {
      parsed = new URL(trimmed);
    } catch (e) {
      // Not an absolute URL; fall back to regexes below
      parsed = null;
    }

    // If it's a drive.google.com URL, try to extract a file ID from known patterns
    if (parsed && parsed.hostname.includes('google.com')) {
      const pathname = parsed.pathname;
      
      // /file/d/FILEID(/view) or /file/d/FILEID/preview
      const fileIdMatch = pathname.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]{25,})/);
      if (fileIdMatch && fileIdMatch[1]) {
        // Use thumbnail endpoint which works better for embedded images
        return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`;
      }

      // /open or /uc with ?id=FILEID or other query param
      const idFromQuery = parsed.searchParams.get('id');
      if (idFromQuery && idFromQuery.length >= 25) {
        return `https://drive.google.com/thumbnail?id=${idFromQuery}&sz=w1000`;
      }

      // Some share links include /folders/ which are not files -> return null so caller can fall back
      if (/((\/folders\/)|(^\/drive\/folders\/))/i.test(pathname)) {
        return null;
      }
    }

    // Generic regex fallback for /d/ or id= patterns
    // Accept file IDs that are typically 25+ characters
    const fallbackPatterns = [
      /\/d\/([a-zA-Z0-9_-]{25,})/,
      /[?&]id=([a-zA-Z0-9_-]{25,})/,
      /file\/d\/([a-zA-Z0-9_-]{25,})/,
      /thumbnail\?id=([a-zA-Z0-9_-]{25,})/
    ];
    
    for (const re of fallbackPatterns) {
      const m = trimmed.match(re);
      if (m && m[1]) {
        return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`;
      }
    }

    // If the user pasted only the file ID itself (typically 33 chars but accept 25+)
    const onlyIdMatch = trimmed.match(/^([a-zA-Z0-9_-]{25,})$/);
    if (onlyIdMatch && onlyIdMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${onlyIdMatch[1]}&sz=w1000`;
    }

    // If it's a generic drive.google.com link we can't parse, return null to signal non-file
    if (/drive\.google\.com/.test(trimmed)) return null;

    // Otherwise assume it's already a usable direct URL (e.g., hosted elsewhere) and return as-is
    return trimmed;
  } catch (e) {
    // On any unexpected error, return null to avoid exposing raw invalid URLs
    console.error('Error normalizing drive link:', e);
    return null;
  }
}

// Helper function to extract file ID from various Google Drive URL formats
export function extractDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  const trimmed = url.trim();
  
  // Try multiple patterns to extract file ID
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]{25,})/,
    /[?&]id=([a-zA-Z0-9_-]{25,})/,
    /^([a-zA-Z0-9_-]{25,})$/  // Just the ID itself
  ];
  
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}