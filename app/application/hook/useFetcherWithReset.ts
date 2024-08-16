import type { FetcherWithComponents } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { AppData } from "@remix-run/react/dist/data";
import type { SerializeFrom } from "@remix-run/server-runtime";

export type FetcherWithComponentsReset<T> = FetcherWithComponents<T> & {
  reset: () => void;
};

export function useFetcherWithReset<T = AppData>(
  opts?: Parameters<typeof useFetcher>[0],
): FetcherWithComponentsReset<SerializeFrom<T>> {
  const fetcher = useFetcher<T>(opts);
  const [data, setData] = useState(fetcher.data);
  useEffect(() => {
    if (fetcher.state === "idle") {
      setData(fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);
  return {
    ...fetcher,
    data: data as SerializeFrom<T>,
    reset: () => setData(undefined),
  };
}