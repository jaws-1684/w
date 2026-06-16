/* eslint-disable @typescript-eslint/no-explicit-any */
export * from "./types.base.ts";
import type { WError } from "../error.ts";
import type { WType } from "../w.ts";
export type Ok<T> = { ok: true; data: T };
export type Err = { ok: false; error: WError };
export type Either<S> = Ok<S> | Err;
export type Infer<T extends WType<any>> = T extends WType<infer O> ? O : never;