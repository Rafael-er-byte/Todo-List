export {};

declare global {
  interface ErrorConstructor {
    captureStackTrace?(
      targetObject?: object,  
      constructorOpt?: (...args: unknown[]) => unknown): void;
  }
}
