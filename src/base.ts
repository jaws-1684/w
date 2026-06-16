/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { WArray } from "./array.ts";
import { WBoolean } from "./boolean.ts";
import { WDate } from "./date.ts";
import { WEnum } from "./enum.ts";
import {
  WAny,
  WLiteral,
  WNaN,
  WNever,
  WNull,
  WUndefined,
  WUnknown,
} from "./literal.ts";
import { WInt, WNumber } from "./number.ts";
import { WObject, type MergeSchemas } from "./object.ts";
import { WEmail, WPassword, WString, WUrl } from "./string.ts";
import { WNullable, WOptional, WTransform } from "./w.ts";
import type { WType } from "./w.ts";
import type { Literal } from "./types/types.base.ts";

export function optional<T extends WType<any>>(schema: T) {
  return new WOptional(schema);
}
export function nullable<T extends WType<any>>(schema: T) {
  return new WNullable(schema);
}
export function transform<Out, In>(
  schema: WType<In>,
  transformFn: (input: In) => Out,
) {
  return new WTransform<Out, In>(schema, transformFn);
}
export function object<T extends Record<PropertyKey, WType<any>>>(inner: T) {
  return new WObject(inner);
}
export function union<const Schemas extends WObject<any, any>[]>(
  s: [...Schemas],
) {
  const unionSchema = s
    .map((obj): Record<PropertyKey, WType<any>> => obj.shape)
    .reduce<Record<PropertyKey, WType<any>>>((acc, schema) => {
      Object.entries(schema).forEach(([key, val]) => {
        acc[key] = val;
      });
      return acc;
    }, {});
  return object(unionSchema as MergeSchemas<Schemas>);
}
export function array<T>(schema: WType<T>) {
  return new WArray(schema);
}
export function string() {
  return new WString();
}
export function email() {
  return new WEmail();
}
export function password() {
  return new WPassword();
}
export function url() {
  return new WUrl();
}
export function number() {
  return new WNumber();
}
export function int() {
  return new WInt();
}
export function boolean() {
  return new WBoolean();
}
export function date() {
  return new WDate();
}
function _enum<const T>(val: readonly T[]) {
  return new WEnum<T>(val);
}
export { _enum as enum };
export function literal<const T extends Literal>(value: T | readonly T[]) {
  return new WLiteral<T>(value);
}

export function nan() {
  return new WNaN();
}

export function any() {
  return new WAny();
}

export function unknown() {
  return new WUnknown();
}

export function never() {
  return new WNever();
}

function _null() {
  return new WNull();
}

function _undefined() {
  return new WUndefined();
}

export { _null as null };
export { _undefined as undefined };
