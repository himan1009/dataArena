"use client";

import { useCallback, useState } from "react";

const DEFAULT_MIN_LOADING_MS = 350;

export function useAsyncAction() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const run = useCallback(
    async <T,>(
      key: string,
      action: () => Promise<T>,
      options?: { minDuration?: number },
    ): Promise<T | undefined> => {
      const minDuration = options?.minDuration ?? DEFAULT_MIN_LOADING_MS;
      setLoadingKey(key);
      const startedAt = Date.now();

      try {
        return await action();
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, minDuration - elapsed);

        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        setLoadingKey((current) => (current === key ? null : current));
      }
    },
    [],
  );

  const isLoading = useCallback(
    (key?: string) => (key ? loadingKey === key : loadingKey !== null),
    [loadingKey],
  );

  return { run, isLoading, loadingKey };
}
