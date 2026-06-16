
import type { ParseContext } from "./types/types.base.ts";
import { WType } from "./w.ts";

export class WBoolean extends WType<boolean> {
  protected validate(ctx: ParseContext) {
    if (typeof ctx.value === "boolean") return ctx;

    ctx.issues.push({
      message: "Expected boolean",
      path: [],
      fatal: true,
    });

    return ctx;
  }
}
