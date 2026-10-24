// lib/ai/rateLimit.ts
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterMs?: number } {
  const key = `${identifier}:${action}`;
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count < maxRequests) {
    record.count++;
    return { allowed: true };
  }

  return {
    allowed: false,
    retryAfterMs: record.resetTime - now,
  };
}

// Cleanup old records periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  requestCounts.forEach((record, key) => {
    if (now > record.resetTime) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => requestCounts.delete(key));
}, 60000);
