class UniappStorage {
  get length() {
    return uni.getStorageInfoSync().keys.length;
  }

  clear() {
    return uni.clearStorageSync();
  }

  getItem(key: string): string | null {
    return uni.getStorageSync(key) || null;
  }

  key(index: number): string | null {
    return uni.getStorageInfoSync().keys[index] || null;
  }

  removeItem(key: string) {
    return uni.removeStorageSync(key);
  }

  setItem(key: string, value: string) {
    return uni.setStorageSync(key, value);
  }
}

export const uniappStorage: Storage = new UniappStorage();

export default uniappStorage;