export type Omit<T extends {}, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Fetch<T> = () => Promise<T>;
