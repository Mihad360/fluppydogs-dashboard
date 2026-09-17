export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (!error || typeof error !== "object") return fallback;

  const err = error as {
    data?: { message?: string; errorMessages?: string };
    message?: string;
    status?: number;
  };

  return (
    err.data?.message ||
    err.data?.errorMessages ||
    err.message ||
    fallback
  );
}
