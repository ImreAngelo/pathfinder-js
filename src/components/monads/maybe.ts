import Monad from "./monad";

/**
 * Maybe Monad for handling nulls and undefined values
 */
export default class Maybe<T> extends Monad<T | null> {
    constructor(value: T | null) {
        super(value);
    }
  
    isNothing(): boolean {
        return this.value == null;
    }
  
    getOrElse(defaultValue: T): T {
        return this.isNothing() ? defaultValue : (this.value as T);
    }
}