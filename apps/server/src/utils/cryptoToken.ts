import crypto from 'crypto';

export function createToken() {
    return getRandomByte(32);
}

export function getRandomByte(len: number) {
    return crypto.randomBytes(len).toString('hex');
}
