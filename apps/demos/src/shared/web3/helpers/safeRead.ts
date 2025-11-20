export async function safeRead<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<Result<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    console.log(`❌ ${label}`, err);
    return {
      ok: false,
      error: `${label} failed`,
      raw: err,
    };
  }
}

type Result<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  raw?: any;
};
