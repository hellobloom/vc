export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R
export type Extend<T, R> = Modify<Exclude<T, string>, R>
