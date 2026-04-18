export class Cache {
  private static instance: Map<string, { data: unknown; timestamp: number }> =
    new Map();
  private static readonly DEFAULT_TTL = 3600000; // 1 hour

  static set(key: string, data: unknown, ttl: number = this.DEFAULT_TTL): void {
    this.instance.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  static get(key: string): unknown | null {
    const item = this.instance.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.timestamp) {
      this.instance.delete(key);
      return null;
    }

    return item.data;
  }

  static clear(key?: string): void {
    if (key) {
      this.instance.delete(key);
    } else {
      this.instance.clear();
    }
  }

  static has(key: string): boolean {
    const item = this.instance.get(key);
    if (!item) return false;

    if (Date.now() > item.timestamp) {
      this.instance.delete(key);
      return false;
    }

    return true;
  }
}
