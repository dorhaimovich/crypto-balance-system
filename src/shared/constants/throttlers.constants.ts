import { ThrottlerOptions } from '@nestjs/throttler';

export class Throttlers {
  static SHORT: ThrottlerOptions = {
    name: 'short',
    ttl: 1000,
    limit: 3,
  };
  static MEDIUM: ThrottlerOptions = {
    name: 'medium',
    ttl: 10000,
    limit: 20,
  };
  static LONG: ThrottlerOptions = {
    name: 'long',
    ttl: 60000,
    limit: 100,
  };

  static getAllThrottlers() {
    return Object.values(this).filter(
      (value): value is ThrottlerOptions =>
        typeof value === 'object' && 'ttl' in value && 'limit' in value,
    );
  }
}
