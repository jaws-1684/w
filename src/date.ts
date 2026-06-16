import type { ParseContext } from "./types/types.base.ts";
import { WType } from "./w.ts";

export class WDate extends WType<Date> {
  protected validate(ctx: ParseContext) {
    if (ctx.value instanceof Date) return ctx;

    ctx.issues.push({
      path: [],
      message: "Expected date",
      fatal: true,
    });

    return ctx;
  }

  min(date: Date) {
    this.validators.push((ctx) => {
      if (ctx.value >= date) return true;

      ctx.issues.push({
        path: [],
        message: "Date is too early",
      });

      return false;
    });

    return this;
  }

  max(date: Date) {
    this.validators.push((ctx) => {
      if (ctx.value <= date) return true;

      ctx.issues.push({
        path: [],
        message: "Date is too late",
      });

      return false;
    });

    return this;
  }
}
