import { fetchMyTokens } from "../actions/read";
import { useEffect, useState } from "react";

// addr is optional in case user disconnects
export const useMyTokens = (address?: `0x${string}`) => {
  const [tokens, setTokens] = useState<bigint[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!address) {
      setTokens([]);
      return;
    }

    const load = async () => {
      setIsFetching(true);
      try {
        const result = await fetchMyTokens(address);
        setTokens(result);
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, [address]);

  return { tokens, isFetching };
};
