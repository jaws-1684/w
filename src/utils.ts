import type { WIssue, Err, Either, Ok } from "./types/types.index.ts";
import { WError } from "./error.ts";

// -------------------------------------------------------------------------------------
// Error Handlers
// -------------------------------------------------------------------------------------

export const err = (issues: WIssue[]): Err => ({
  ok: false,
  error: new WError(issues),
});
export const ok = <T>(data: T): Ok<T> => ({ ok: true, data });
export const isErr = <O>(obj: Either<O>): obj is Err => obj.ok === false;
export const isOk = <O>(obj: Either<O>): obj is Ok<O> => obj.ok === true;

// -------------------------------------------------------------------------------------
// REGEXES
// -------------------------------------------------------------------------------------
/* eslint-disable no-useless-escape */
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
const URL_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/i;
const IMAGE_URL_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)$/i;


// -------------------------------------------------------------------------------------
// Predicates
// -------------------------------------------------------------------------------------

export const isString = (v: unknown): v is string =>
  typeof v === "string" || v instanceof String;
export const isEmail = (v: unknown): v is string => isString(v) && EMAIL_REGEX.test(v);
export const isPassword = (v: unknown): v is string => isString(v) && v.length >= 8;
export const isUrl = (v: unknown): v is string => isString(v) && URL_REGEX.test(v);
export const isImageUrl = (v: unknown): v is string =>
  isString(v) && IMAGE_URL_REGEX.test(v);
export const isObject = (object: unknown): object is Record<PropertyKey, unknown> =>
  !(!object || typeof object !== "object");
export const isEmpty = (value: object | unknown[]) => {
  return Array.isArray(value)
    ? value.length === 0
    : Object.keys(value).length === 0;
};
export const isInteger = (v: unknown): v is number =>
  isNumber(v) && Number.isInteger(v);
export const isNumber = (v: unknown): v is number =>
  typeof v === "number" && !Number.isNaN(v) && Number.isFinite(v);

