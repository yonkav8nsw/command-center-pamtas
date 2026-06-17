/**
 * Konversi Google Drive share link ke URL yang bisa di-embed/tampilkan langsung
 * Input: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function driveToDirectUrl(shareUrl) {
  if (!shareUrl) return null

  // Format: /file/d/ID/view
  const fileMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`
  }

  // Format: id=ID
  const idMatch = shareUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`
  }

  // Sudah dalam format direct, kembalikan apa adanya
  return shareUrl
}

/**
 * Konversi ke URL thumbnail (lebih cepat untuk preview)
 */
export function driveToThumbnail(shareUrl, size = 400) {
  if (!shareUrl) return null
  const fileMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w${size}`
  }
  return driveToDirectUrl(shareUrl)
}

/**
 * Cek apakah URL adalah link Google Drive
 */
export function isDriveUrl(url) {
  return url && url.includes('drive.google.com')
}
