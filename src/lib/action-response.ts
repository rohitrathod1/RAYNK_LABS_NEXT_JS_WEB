// Typed response wrappers for Server Actions.
// Never throw from server actions — always return ActionResponse.

export type ActionResponse<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; issues?: Record<string, string[]> };

export function ok<T>(data?: T, message?: string): ActionResponse<T> {
  return { success: true, data, message };
}

export function fail(
  error: string,
  issues?: Record<string, string[]>,
): ActionResponse<never> {
  return { success: false, error, issues };
}
