import type { ParseContext } from "./types/types.base.ts";
import { WOptional } from "./w.ts";
import { isObject, isOk } from "./utils.ts";
import { WType } from "./w.ts";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
type ExtendShape<A, B> = {
  [K in Exclude<keyof A, keyof B>]: A[K];
} & {
  [K in keyof B]: B[K];
};

export type MergeSchemas<Schemas extends WObject<any, any>[]> = Schemas extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends WObject<infer S, any>
    ? Tail extends WObject<any, any>[]
      ? ExtendShape<S, MergeSchemas<Tail>>
      : S
    : never
  : Record<never, never>;
type PartialExclude<Schema> = Partial<Record<keyof Schema, false>>;
type EmptyExclude = Record<never, never>;
type PartialSchema<
  Schema extends Record<string, WType<any>>,
  B extends PartialExclude<Schema> = EmptyExclude,
> = {
  [K in keyof Schema]: K extends keyof B ? Schema[K] : WOptional<Schema[K]>;
};
type PickSchema<
  Schema extends Record<string, WType<any>>,
  K extends keyof Schema,
> = {
  [P in K]: Schema[P];
};
type OmitSchema<
  Schema extends Record<string, WType<any>>,
  K extends keyof Schema,
> = {
  [P in Exclude<keyof Schema, K>]: Schema[P];
};
type ObjectOutput<Schema> = {
  [K in keyof Schema as Schema[K] extends WOptional<any>
    ? K
    : never]?: Schema[K] extends WType<infer O> ? O : never;
} & {
  [K in keyof Schema as Schema[K] extends WOptional<any>
    ? never
    : K]: Schema[K] extends WType<infer O> ? O : never;
};

export class WObject<
  const Schema extends Record<PropertyKey, WType<any>>,
  O extends ObjectOutput<Schema>,
> extends WType<O> {
  #schema: Schema;
  constructor(schema: Schema) {
    super();
    this.#schema = schema;
  }

  protected validate(ctx: ParseContext) {
    if (!isObject(ctx.value)) {
      ctx.issues.push({ message: "Expected object", path: [], fatal: true });
      return ctx;
    }

    const successCtx = ctx as ParseContext<Record<PropertyKey, unknown>>;

    for (const key in this.#schema) {
      const innerRes = this.#schema[key].safeParse(successCtx.value[key]);

      if (isOk(innerRes)) {
        if (key in successCtx.value || innerRes.data !== undefined) {
          successCtx.value[key] = innerRes.data;
        }
      } else {
        ctx.issues.push(
          ...innerRes.error.issues.map((issue) => {
            return {
              ...issue,
              path: [key, ...issue.path],
            };
          }),
        );
      }
    }

    return ctx;
  }
  partial<B extends PartialExclude<Schema> = EmptyExclude>(booleans?: B) {
    const resolvedBooleans = (booleans ?? {}) as B;
    const reducer = (
      acc: Record<string, WType<any>>,
      current: [string, unknown],
    ) => {
      const [key, val] = current;
      const wType = val as WType<any>;
      if (
        key in resolvedBooleans &&
        resolvedBooleans[key as keyof B] === false
      ) {
        acc[key] = wType;
      } else {
        acc[key] = new WOptional(wType);
      }
      return acc;
    };

    const partialSchema = Object.entries(this.#schema).reduce(reducer, {});
    return new WObject(partialSchema as PartialSchema<Schema, B>);
  }
  pick<K extends keyof Schema>(keys: K[]) {
    const pickedSchema = Object.entries(this.#schema).reduce<
      Record<string, any>
    >((acc, [key, val]) => {
      if (keys.includes(key as K)) {
        acc[key] = val;
      }
      return acc;
    }, {});

    return new WObject(pickedSchema as PickSchema<Schema, K>);
  }
  omit<K extends keyof Schema>(keys: K[]) {
    const omittedSchema = Object.entries(this.#schema).reduce<
      Record<string, any>
    >((acc, [key, val]) => {
      if (!keys.includes(key as K)) {
        acc[key] = val;
      }
      return acc;
    }, {});

    return new WObject(omittedSchema as OmitSchema<Schema, K>);
  }
  get shape() {
    return { ...this.#schema };
  }
}