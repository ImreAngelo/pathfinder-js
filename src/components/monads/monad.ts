/**
 * A monad is a monoid in the category of endofunctors
 */
export default class Monad<T> {
    protected value: T;
  
    constructor(value: T) {
        this.value = value;
    }
  
    static of<T>(value: T) {
        return new Monad(value);
    }
  
    map<U>(fn: (value: T) => U): Monad<U> {
        return Monad.of(fn(this.value));
    }
  
    flatMap<U>(fn: (value: T) => Monad<U>): Monad<U> {
        return fn(this.value);
    }
  
    getValue(): T {
        return this.value;
    }
}