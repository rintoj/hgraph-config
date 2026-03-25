import * as dotenv from "dotenv";
import { CleanedEnv, cleanEnv, makeValidator, str } from "envalid";
import ms from "ms";
import type { StringValue } from "ms";
import { resolve } from "path";

const environmentMap = {
  prod: "prod",
  production: "prod",
  PRODUCTION: "prod",
  PROD: "prod",
  test: "test",
  TEST: "test",
  dev: "dev",
  development: "dev",
  DEVELOPMENT: "dev",
  local: "local",
  LOCAL: "local",
};

export function nodeEnv(choices: string[] = Object.keys(environmentMap)) {
  return { NODE_ENV: str({ choices }) };
}

export interface ConfigOptions {
  baseDir?: string;
  showEnvironmentFiles?: boolean;
}

export function configure<S>(spec: S, options?: ConfigOptions): CleanedEnv<S> {
  const { baseDir = process.cwd(), showEnvironmentFiles } = options ?? {};
  const path = [
    (environmentMap as any)[process.env.NODE_ENV as string] as string,
    ".env",
  ]
    .filter(Boolean)
    .map((config) => resolve(baseDir, config));
  if (showEnvironmentFiles) {
    console.log("Environment files:", path.join(", "));
  }
  dotenv.config({ path });
  return cleanEnv(process.env, {
    ...spec,
  });
}

export const duration = makeValidator<number>((input: string) => {
  if (/^\d+$/.test(input)) {
    throw new Error(
      `Invalid duration: "${input}". Bare numbers are ambiguous. Use a unit suffix like "${input}ms", "${input}s", etc.`
    );
  }
  const result = ms(input as StringValue);
  if (typeof result !== "number") {
    throw new Error(
      `Invalid duration: "${input}". Expected a value like "1d", "2h", "30s", etc.`
    );
  }
  return result;
});

export type { StringValue } from "ms";

export {
  bool,
  email,
  EnvError,
  EnvMissingError,
  host,
  json,
  makeValidator,
  num,
  port,
  str,
  testOnly,
  url,
} from "envalid";
