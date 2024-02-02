type FetchDataFunction<T> = () => Promise<T>;

class CacheData<T> {
  private data: { value: T; timestamp: number } | null = null;
  private defaultExpiration: number;
  private fetchData: FetchDataFunction<T>;

  constructor(fetchData: FetchDataFunction<T>, defaultExpiration: number = 1000 * 60 * 3) {
    this.fetchData = fetchData;
    this.defaultExpiration = defaultExpiration;
  }

  private isExpired(): boolean {
    if (!this.data) {
      return true;
    }

    const currentTime = new Date().getTime();
    return currentTime - this.data.timestamp > this.defaultExpiration;
  }

  get(): T | null {
    return this.isExpired() ? null : this.data?.value || null;
  }

  set(value: T): void {
    const timestamp = new Date().getTime();
    this.data = { value, timestamp };
  }

  fetch(): Promise<T | null> {
    if (!this.isExpired()) {
      return Promise.resolve(this.data?.value || null);
    }

    return this.fetchData().then((data) => {
      this.set(data);
      return data;
    });
  }

  refetch(): Promise<T | null> {
    return this.fetchData().then((data) => {
      this.set(data);
      return data;
    });
  }

  clear(): void {
    this.data = null;
  }
}

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const postsCache = new CacheData<Post[]>(() =>
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => data as Post[])
);
