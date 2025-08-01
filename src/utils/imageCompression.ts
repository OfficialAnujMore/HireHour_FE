/**
 * Utility functions for image compression and size management
 */

/**
 * Calculate the approximate size of a base64 string in bytes
 * @param base64String - The base64 encoded string
 * @returns Size in bytes
 */
export const getBase64Size = (base64String: string): number => {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '')
  // Base64 encoding increases size by ~33%, so we decode to get original size
  return Math.ceil((base64Data.length * 3) / 4)
}

/**
 * Convert bytes to MB
 * @param bytes - Size in bytes
 * @returns Size in MB
 */
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024)
}

/**
 * Check if image size is within acceptable limits
 * @param base64String - The base64 encoded image
 * @param maxSizeMB - Maximum size in MB (default: 5MB)
 * @returns Object with isWithinLimit and size info
 */
export const checkImageSize = (
  base64String: string, 
  maxSizeMB: number = 5
): { isWithinLimit: boolean; sizeMB: number; maxSizeMB: number } => {
  const sizeBytes = getBase64Size(base64String)
  const sizeMB = bytesToMB(sizeBytes)
  
  return {
    isWithinLimit: sizeMB <= maxSizeMB,
    sizeMB,
    maxSizeMB
  }
}

/**
 * Validate multiple images for size limits
 * @param images - Array of base64 image strings
 * @param maxSizeMB - Maximum size per image in MB (default: 5MB)
 * @param maxTotalSizeMB - Maximum total size in MB (default: 20MB)
 * @returns Validation result
 */
export const validateImages = (
  images: string[],
  maxSizeMB: number = 5,
  maxTotalSizeMB: number = 20
): {
  isValid: boolean;
  errors: string[];
  totalSizeMB: number;
  imageSizes: { index: number; sizeMB: number; isValid: boolean }[];
} => {
  const errors: string[] = []
  const imageSizes: { index: number; sizeMB: number; isValid: boolean }[] = []
  let totalSizeMB = 0

  images.forEach((image, index) => {
    const sizeCheck = checkImageSize(image, maxSizeMB)
    imageSizes.push({
      index,
      sizeMB: sizeCheck.sizeMB,
      isValid: sizeCheck.isWithinLimit
    })

    if (!sizeCheck.isWithinLimit) {
      errors.push(`Image ${index + 1} is too large (${sizeCheck.sizeMB.toFixed(2)}MB). Maximum allowed is ${maxSizeMB}MB.`)
    }

    totalSizeMB += sizeCheck.sizeMB
  })

  if (totalSizeMB > maxTotalSizeMB) {
    errors.push(`Total image size (${totalSizeMB.toFixed(2)}MB) exceeds maximum allowed (${maxTotalSizeMB}MB).`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    totalSizeMB,
    imageSizes
  }
} 