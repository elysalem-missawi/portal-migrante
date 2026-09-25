import type { HttpError } from "../services/api";

type Translator = (key: string) => string;

/** Converts API/network errors into safe, user-facing messages. */
export function getUserFriendlyError(
  error: unknown,
  t: Translator,
  fallbackKey = "user_create_error"
): string {
  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as HttpError).status === "number"
      ? (error as HttpError).status
      : undefined;

  if (status === 409) return t("error_email_exists");
  if (status === 400 || status === 422) return t("error_invalid_data");
  if (status === 401) return t("login_invalid_credentials");
  if (status === 403) return t("error_not_allowed");
  if (status === 404) return t("error_not_found");
  if (status === 429) return t("error_too_many_requests");
  if (status !== undefined && status >= 500) return t("error_server");

  if (error instanceof TypeError) {
    return t("error_network");
  }

  return t(fallbackKey);
}
