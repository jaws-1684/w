/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Either, Infer, ParseContext } from "./types/types.index.ts";
import { err, isEmpty, isOk, ok } from "./utils.ts";

export abstract class WType<T> {
  protected validators: Array<(ctx: ParseContext<T>) => boolean> = [];
  protected customValidators: Array<(ctx: ParseContext<T>) => boolean> = [];
  protected transforms: Array<(input: T) => T> = [];
  protected coerces: Array<(input: T) => T> = [];
  protected abstract validate(ctx: ParseContext): ParseContext;

  #default: T | undefined;

  parse(input: unknown): T {
    const result = this.safeParse(input);
    if (isOk(result)) return result.data;
    throw result.error;
  }

  safeParse(input: unknown): Either<T> {
    if (input === undefined && this.#default !== undefined) {
      return ok(this.#default);
    }
    const result = this.validate({ value: input, issues: [] });

    if (result.issues.some((issue) => issue.fatal && issue.path.length === 0)) {
      return err(result.issues);
    }

    const okData = result as ParseContext<T>;

    this.validators.forEach((fn) => fn(okData));

    if (result.issues.some((issue) => issue.fatal)) {
      return err(okData.issues);
    }
    this.customValidators.forEach((fn) => fn(okData));

    if (!isEmpty(okData.issues)) {
      return err(okData.issues);
    }
    return ok(this.transforms.reduce((acc, fn) => fn(acc), okData.value));
  }
  optional(): WOptional<this>{
    return new WOptional(this);
  }
  transform<Out>(fn: (input: T) => Out) {
    return new WTransform<Out, T>(this, fn);
  }
  default(val: T) {
    this.#default = val;

    return this;
  }
  nullable(): WNullable<this> {
    return new WNullable(this);
  }
  refine(fn: (input: T) => boolean, message: string) {
    this.customValidators.push((ctx) => {
      if (fn(ctx.value)) return true;

      ctx.issues.push({ message, path: [] });

      return false;
    });

    return this;
  }
}
export class WNullable<T extends WType<any>> extends WType<null | Infer<T>> {
  #schema: T;
  constructor(schema: T) {
    super();
    this.#schema = schema;
  }

  protected validate(ctx: ParseContext) {
    if (ctx.value === null) return ctx;

    const res = this.#schema.safeParse(ctx.value);
    if (isOk(res)) {
      ctx.value = res.data;
    } else {
      ctx.issues.push(...res.error.issues);
    }

    return ctx;
  }
}
export class WOptional<T extends WType<any>> extends WType<undefined | Infer<T>> {
  #schema: T;
  constructor(schema: T) {
    super();
    this.#schema = schema;
  }

  protected validate(ctx: ParseContext) {
    if (ctx.value === undefined) return ctx;
    const result = this.#schema.safeParse(ctx.value);
    if (isOk(result)) {
      ctx.value = result.data;
    } else {
      ctx.issues.push(...result.error.issues);
    }

    return ctx;
  }
}
export class WTransform<Out, In> extends WType<Out> {
  #inputSchema: WType<In>;
  #transformFn: (input: In) => Out;

  constructor(schema: WType<In>, transformFn: (input: In) => Out) {
    super();
    this.#inputSchema = schema;
    this.#transformFn = transformFn;
  }

  protected validate(ctx: ParseContext) {
    const res = this.#inputSchema.safeParse(ctx.value);

    if (isOk(res)) {
      ctx.value = this.#transformFn(res.data);
    } else {
      ctx.issues.push(...res.error.issues);
    }

    return ctx;
  }
}