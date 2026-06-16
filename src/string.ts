import { WInt } from "./number.ts";
import type { ParseContext } from "./types/types.base.ts";
import { isEmail, isImageUrl, isPassword, isString, isUrl } from "./utils.ts";
import { WType } from "./w.ts";

export class WString extends WType<string> {
  protected validate(ctx: ParseContext) {
    if (isString(ctx.value)) return ctx;

    ctx.issues.push({ path: [], message: "Expected string", fatal: true });

    return ctx;
  }

  min(length: number) {
    this.validators.push((ctx) => {
      if (ctx.value.length >= length) return true;

      ctx.issues.push({
        path: [],
        message: `String is too short, minumum length: ${length}`,
      });

      return false;
    });

    return this;
  }

  max(length: number) {
    this.validators.push((ctx) => {
      if (ctx.value.length <= length) return true;

      ctx.issues.push({
        path: [],
        message: `String is too long, maximun length: ${length}`,
      });

      return false;
    });

    return this;
  }

  length(length: number) {
    this.validators.push((ctx) => {
      if (ctx.value.length === length) return true;

      ctx.issues.push({ path: [], message: "String is not the exact length" });

      return false;
    });

    return this;
  }

  regex(pattern: RegExp) {
    this.validators.push((ctx) => {
      if (ctx.value.match(pattern)) return true;

      ctx.issues.push({
        path: [],
        message: "String does not match the pattern",
      });

      return false;
    });

    return this;
  }

  trim() {
    this.transforms.push((input) => input.trim());
    return this;
  }

  toLowerCase() {
    this.transforms.push((input) => input.toLowerCase());
    return this;
  }

  toUpperCase() {
    this.transforms.push((input) => input.toUpperCase());
    return this;
  }
  toInteger() {
    return new WInt();
  }
  escape(mode: "soft" | "aggresive" = "soft") {
    const AGGRESSIVE_ESCAPE_REGEX = /[^0-9A-Za-z ]/g;
    const SOFT_ESCAPE_REGEX = /[<>&"']/g;
    const currentRegex =
      mode === "soft" ? SOFT_ESCAPE_REGEX : AGGRESSIVE_ESCAPE_REGEX;
    this.transforms.push((input) =>
      input.replace(currentRegex, (c) => "&#" + c.charCodeAt(0) + ";"),
    );
    return this;
  }
}
export class StringExtension extends WString {
  ctx: ParseContext;
  isPredicate: (value: string) => boolean;
  message: string;

  constructor(
    ctx: ParseContext,
    isPredicate: (value: string) => boolean,
    message: string,
  ) {
    super();
    this.ctx = ctx;
    this.isPredicate = isPredicate;
    this.message = message;
  }
  validate() {
    const newCtx = super.validate(this.ctx);
    if (this.ctx.issues.length !== newCtx.issues.length) return newCtx;

    const stringCtx = newCtx as ParseContext<string>;

    if (this.isPredicate(stringCtx.value)) return stringCtx;

    stringCtx.issues.push({ path: [], message: this.message });

    return stringCtx;
  }
}
export class WEmail extends WString {
  protected validate(ctx: ParseContext) {
    return new StringExtension(ctx, isEmail, "Invalid email").validate();
  }
}
export class WUrl extends WString {
  protected validate(ctx: ParseContext) {
    const stringCtx = new StringExtension(ctx, isUrl, "Invalid url").validate();
    return stringCtx;
  }
  image() {
    this.validators.push((ctx) => {
      if (isImageUrl(ctx.value)) return true;

      ctx.issues.push({
        path: [],
        message: "It's not an image url",
      });

      return false;
    });

    return this;
  }
}
export class WPassword extends WString {
  protected validate(ctx: ParseContext) {
    return new StringExtension(ctx, isPassword, "Invalid password").validate();
  }
}
