import type { WIssue } from "./types/types.base";
export class WError extends Error {
  issues: WIssue[];

  constructor(issues: WIssue[]) {
    super(JSON.stringify(issues));

    this.name = "WError";
    this.issues = issues;
  }
}