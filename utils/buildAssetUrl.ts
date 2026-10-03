import { API_BASE_URL } from '../config';

export function buildAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path}`;
}
