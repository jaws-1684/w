import type { ParseContext } from "./types/types.base.ts";
import { WType } from "./w.ts";

export class WEnum<const T> extends WType<T> {
  #values: readonly T[];

  constructor(values: readonly T[]) {
    super();
    this.#values = values;
  }

  protected validate(ctx: ParseContext) {
    if (this.#values.includes(ctx.value as T)) return ctx;

    ctx.issues.push({
      path: [],
      message: "Expected correct enum",
      fatal: true,
    });
    return ctx;
  }
}
