export type WIssue = {
  message: string;
  fatal?: boolean;
  path: PropertyKey[];
};
export type ParseContext<T = unknown> = {
  value: T;
  issues: WIssue[];
};
export type Literal = string | number | bigint | boolean | null | undefined;