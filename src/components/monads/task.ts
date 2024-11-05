export default class Task<T> {
    constructor(private readonly executor: () => Promise<T>) {}
  
    static of<T>(value: T): Task<T> {
      return new Task(() => Promise.resolve(value));
    }
  
    static fromPromise<T>(promise: Promise<T>): Task<T> {
      return new Task(() => promise);
    }
  
    map<R>(fn: (value: T) => R): Task<R> {
      return new Task(() => this.executor().then(fn));
    }
  
    chain<R>(fn: (value: T) => Task<R>): Task<R> {
      return new Task(() => this.executor().then(value => fn(value).executor()));
    }
  
    run(): Promise<T> {
      return this.executor();
    }
  }
  