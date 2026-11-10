const ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;
const SALT_BYTE_LENGTH = 16;

function buf2hex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hex2buf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Constant-time byte array comparison to prevent timing attack vulnerabilities.
 */
function constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Hashes a plaintext password using PBKDF2 (SHA-256, 100,000 iterations).
 * Standard Web Crypto API compatible with Cloudflare Workers (Edge), Node.js 22+, and Bun.
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTE_LENGTH));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH_BITS
  );

  return `pbkdf2:${ITERATIONS}:${buf2hex(salt)}:${buf2hex(derived)}`;
}

/**
 * Verifies a plaintext password against a stored PBKDF2 hash using constant-time comparison.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const salt = hex2buf(parts[2]);
    const expectedHash = hex2buf(parts[3]);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derived = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as unknown as ArrayBuffer,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      KEY_LENGTH_BITS
    );

    return constantTimeCompare(new Uint8Array(derived), expectedHash);
  } catch {
    return false;
  }
}
