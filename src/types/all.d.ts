declare global {
  interface Window extends globalThis {
    version?: string;
  }
}
