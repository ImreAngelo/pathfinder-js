import { Maybe } from "./maybe";

export class Just<T> extends Maybe<T> {
    constructor(private value: T) {
        super();
    }
  
    bind<U>(func: (value: T) => Maybe<U>): Maybe<U> {
        return func(this.value);
    }
    
    getValue(): T {
        return this.value;
    }
}