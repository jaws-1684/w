import { WInt, WNumber } from "./number.ts";
import type { ParseContext } from "./types/types.base.ts";
import { isInteger, isNumber } from "./utils.ts";

export class coerce {
    static number(){
        return new CoercedNumber();
    }
    static int() {
        return new CoercedInteger();
    }
}
class CoercedNumber extends WNumber {
  protected validate(ctx: ParseContext): ParseContext {
    const coerced = Number(ctx.value);
    if (isNumber(coerced)) {
      return super.validate({ ...ctx, value: coerced });
    }
    ctx.issues.push({
      path: [],
      message: "Can't coerce to number",
      fatal: true,
    });
    return ctx;
  }
  int() {
    return new CoercedInteger();
  }
}

class CoercedInteger extends WInt {
  protected validate(ctx: ParseContext): ParseContext {
    const coerced = Number(ctx.value);
    if (isInteger(coerced)) {
      return super.validate({ ...ctx, value: coerced });
    }
    ctx.issues.push({
      path: [],
      message: "Can't coerce to integer",
      fatal: true,
    });
    return ctx;
  }
}