// Maybe handles undefined values
export abstract class Maybe<T> {
    public constructor(protected value: T | null) {}
}


