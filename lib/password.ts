import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// 비밀글(문의) 비밀번호 해싱. bcrypt 등 외부 패키지 없이 Node 내장 crypto의
// scrypt(+ salt)로 처리한다. 저장 형식: "<salt-hex>:<hash-hex>".
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_FORMAT = /^[0-9a-f]{32}:[0-9a-f]{128}$/;

export function hashPassword(password: string): string {
    const salt = randomBytes(SALT_BYTES).toString("hex");
    const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
    if (!password || !stored) return false;

    if (HASH_FORMAT.test(stored)) {
        const [salt, hash] = stored.split(":");
        const hashBuffer = Buffer.from(hash, "hex");
        const candidateBuffer = scryptSync(password, salt, KEY_LENGTH);
        return timingSafeEqual(candidateBuffer, hashBuffer);
    }

    // 해싱 도입 이전에 평문으로 저장된 값과의 하위 호환 비교 (길이가 다르면 즉시 false).
    const storedBuffer = Buffer.from(stored);
    const passwordBuffer = Buffer.from(password);
    if (storedBuffer.length !== passwordBuffer.length) return false;
    return timingSafeEqual(passwordBuffer, storedBuffer);
}
