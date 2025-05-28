/**
 * Formats dates consistently across server and client
 * to prevent hydration errors
 */

/**
 * Format a date in a consistent way that works for both server and client rendering
 * @param dateString ISO date string or Date object
 * @returns Formatted date string in a consistent format
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) {
    return 'N/A';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // Use explicit formatting options to ensure consistency
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format for consistency
  });
}

/**
 * Format a date in a short format (date only)
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (date only)
 */
export function formatShortDate(dateString: string | Date | null | undefined): string {
  if (!dateString) {
    return 'N/A';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format a date in a time-only format
 * @param dateString ISO date string or Date object
 * @returns Formatted time string
 */
export function formatTime(dateString: string | Date | null | undefined): string {
  if (!dateString) {
    return 'N/A';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Time';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format for consistency
  });
}
