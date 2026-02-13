/**
 * URL validation utility — prevents javascript: and data: scheme attacks
 * when opening user-provided URLs via window.open().
 */
export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function safeWindowOpen(url: string, target: string = '_blank'): void {
  if (isValidExternalUrl(url)) {
    window.open(url, target, 'noopener,noreferrer');
  } else {
    console.warn('Blocked unsafe URL:', url);
  }
}
