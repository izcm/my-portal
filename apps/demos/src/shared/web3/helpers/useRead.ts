import { useEffect, useRef, useState } from "react";

export const useRead = <T>(fn: () => Promise<T>, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fn();
        if (!cancelled) {
          setData(result);
          setIsFetched(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, isLoading, isFetched, error };
};
