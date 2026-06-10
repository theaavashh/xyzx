export type Result<T, E = Error> = 
  | { ok: true; data: T }
  | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({
  ok: true,
  data,
});

export const err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; data: T } =>
  result.ok === true;

export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } =>
  result.ok === false;

export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U,
): Result<U, E> => {
  if (isOk(result)) {
    return ok(fn(result.data));
  }
  return result;
};

export const mapErr = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> => {
  if (isErr(result)) {
    return err(fn(result.error));
  }
  return result;
};

export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>,
): Result<U, E> => {
  if (isOk(result)) {
    return fn(result.data);
  }
  return result;
};

export const fromPromise = async <T, E = Error>(
  promise: Promise<T>,
  errorTransformer?: (e: unknown) => E,
): Promise<Result<T, E>> => {
  try {
    const data = await promise;
    return ok(data);
  } catch (error) {
    const errorToUse = errorTransformer 
      ? errorTransformer(error) 
      : (error instanceof Error ? error : new Error(String(error))) as E;
    return err(errorToUse);
  }
};

export const fromTryCatch = <T, E = Error>(
  fn: () => T,
  errorTransformer?: (e: unknown) => E,
): Result<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    const errorToUse = errorTransformer 
      ? errorTransformer(error) 
      : (error instanceof Error ? error : new Error(String(error))) as E;
    return err(errorToUse);
  }
};

export const getOrElse = <T, E>(
  result: Result<T, E>,
  defaultValue: T,
): T => {
  if (isOk(result)) {
    return result.data;
  }
  return defaultValue;
};

export const getOrElseThrow = <T, E extends Error>(
  result: Result<T, E>,
): T => {
  if (isOk(result)) {
    return result.data;
  }
  throw result.error;
};

export const tryCatch = async <T, E = Error>(
  fn: () => Promise<T>,
): Promise<Result<T, E>> => {
  try {
    const data = await fn();
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
};