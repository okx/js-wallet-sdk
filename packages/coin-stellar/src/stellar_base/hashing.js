import { sha256 } from 'sha.js';

export function hash(data) {
  const hasher = new sha256();
  hasher.update(data, 'utf8');
  return hasher.digest();
}
