import { Maybe } from "./maybe";

export class Nothing<T> extends Maybe<T> {
    bind<U>(_func?: (value: T) => Maybe<U>): Maybe<U> {
        return new Nothing<U>();
    }
}