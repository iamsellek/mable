export type GenericObject<T> = Record<string | number, T>;

export type VoidCallback<T> = (item: T, index: number) => void;
export type VoidCallbackAsync<T> = (item: T, index: number) => Promise<void>;
export type ReturnGenericCallback<T> = (item: T, index: number) => T;
export type ReturnGenericCallbackAsync<T> = (
  item: T,
  index: number
) => Promise<T>;
export type BooleanCallback<T> = (item: T, index: number) => boolean;
export type BooleanCallbackAsync<T> = (
  item: T,
  index: number
) => Promise<boolean>;
