import type { Literal, ParseContext } from "./types/types.base.ts";
import { WType } from "./w.ts";

export class WLiteral<const T extends Literal> extends WType<T> {
  #values: readonly T[];

  constructor(value: T | readonly T[]) {
    super();
    this.#values = Array.isArray(value) ? value : [value];
  }

  protected validate(ctx: ParseContext) {
    if (this.#values.includes(ctx.value as T)) return ctx;

    ctx.issues.push({
      path: [],
      message: `Expected ${this.#values
        .map((v) => JSON.stringify(v))
        .join(", ")}`,
      fatal: true,
    });
    return ctx;
  }
}

export class WNull extends WLiteral<null> {
  constructor() {
    super(null);
  }
}

export class WUndefined extends WLiteral<undefined> {
  constructor() {
    super(undefined);
  }
}

export class WNaN extends WType<number> {
  protected validate(ctx: ParseContext) {
    if (Number.isNaN(ctx.value)) return ctx;

    ctx.issues.push({
      path: [],
      message: "Expected NaN",
      fatal: true,
    });
    return ctx;
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export class WAny extends WType<any> {
  protected validate(ctx: ParseContext) {
    return ctx;
  }
}

export class WUnknown extends WType<unknown> {
  protected validate(ctx: ParseContext) {
    return ctx;
  }
}

export class WNever extends WType<never> {
  protected validate(ctx: ParseContext) {
    ctx.issues.push({
      path: [],
      message: "Expected never",
      fatal: true,
    });

    return ctx;
  }
}
