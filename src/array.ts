/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ParseContext } from "./types/types.base.ts";
import { isOk } from "./utils.ts";
import { WType } from "./w.ts";

export class WArray<T> extends WType<T[]> {
  #inner: WType<T>;

  constructor(schema: WType<T>) {
    super();
    this.#inner = schema;
  }

  protected validate(ctx: ParseContext) {
    if (!Array.isArray(ctx.value)) {
      ctx.issues.push({ message: "Expected array", path: [], fatal: true });
      return ctx;
    }

    for (let i = 0; i < ctx.value.length; i++) {
      const item = ctx.value[i];
      const innerRes = this.#inner.safeParse(item);
      if (isOk(innerRes)) {
        ctx.value[i] = innerRes.data;
      } else {
        ctx.issues.push(
          ...innerRes.error.issues.map((issue) => {
            return {
              ...issue,
              path: [i, ...issue.path],
            };
          }),
        );
      }
    }

    return ctx;
  }

  min(length: number) {
    this.validators.push((ctx) => {
      if (ctx.value.length >= length) return true;

      ctx.issues.push({ path: [], message: "Array is too short" });

      return false;
    });

    return this;
  }

  max(length: number) {
    this.validators.push((ctx) => {
      if (ctx.value.length <= length) return true;

      ctx.issues.push({ path: [], message: "Array is too long" });

      return false;
    });

    return this;
  }

  length(length: number) {
    this.validators.push((ctx) => {
      if (ctx.value.length === length) return true;

      ctx.issues.push({ path: [], message: "Array is not the exact length" });

      return false;
    });

    return this;
  }
}