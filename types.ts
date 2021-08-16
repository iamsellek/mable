export type VoidCallback<T> = (item: T, index: number) => void;
export type ReturnGenericCallback<T> = (item: T, index: number) => T;
export type BooleanCallback<T> = (item: T, index: number) => boolean;
