import { ContractFunctionRevertedError } from "viem";
import { ContractFunctionExecutionError } from "viem";

// local
import { MINI_NFT_ERRORS as errors } from "../../../features/miniNFT/data/errors";

export async function safeRead<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<Result<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    let errMsg = `${label} failed`;

    if (
      err instanceof ContractFunctionExecutionError &&
      err.cause instanceof ContractFunctionRevertedError
    ) {
      const decoded = err.cause.data;
      const name = decoded?.errorName;

      if (name && name in errors) {
        errMsg = errors[name as keyof typeof errors];
      }
    }

    return {
      ok: false,
      error: errMsg,
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
