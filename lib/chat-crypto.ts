import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY || 'default_fallback_key_must_be_32_bytes_long_!!!';

// Hash key to ensure it is exactly 32 bytes
function getSecretKey(): Buffer {
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
}

/**
 * Encrypts a plaintext string using AES-256-CBC.
 * Returns the IV and ciphertext separated by a colon.
 */
export function encryptMessage(text: string): string {
  if (!text) return text;
  
  const key = getSecretKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a ciphertext string using AES-256-CBC.
 * If decryption fails or format is invalid, returns the original text to maintain backward compatibility.
 */
export function decryptMessage(text: string): string {
  if (!text) return text;
  
  const parts = text.split(':');
  if (parts.length !== 2) {
    // Return original message if it is not in the encrypted format
    return text;
  }
  
  try {
    const key = getSecretKey();
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed, assuming plaintext message:', error);
    return text;
  }
}
