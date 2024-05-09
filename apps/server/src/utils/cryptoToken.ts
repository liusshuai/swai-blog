import crypto from 'crypto';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}
