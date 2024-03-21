import { useContext, useEffect, useState } from "react";
import { JobItem, TJobItemContent } from "./types";
import { BASE_URL_API } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../context/BookmarksContextProvider";
import { ActiveIdContext } from "../context/ActiveIdContextProvider";
import { SearchTextContext } from "../context/SearchTextContextProvider";
import { JobItemsContext } from "../context/JobItemsContextProvider";

type JobItemApiResponse = {
  public: boolean;
  jobItem: TJobItemContent;
};

/*****************************************************
 * Fecth job items from the API
 *
 ****************************************************/

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_URL_API}/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data;
};

/*****************************************************
 * Load job item from the API
 * Extracting the ID for comparison and make it debounced
 * using react query
 ****************************************************/

export function useJobItem(id: number | null) {
  const { data, isInitialLoading } = useQuery(
    ["job-item", id],
    () => (id ? fetchJobItem(id) : null),
    {
      staleTime: 1000 * 60 * 60, // 5 minutes
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    }
  );

  const isLoading = isInitialLoading;
  return { activeJobItem: data?.jobItem, isLoading } as const;
}

/*****************************************************
 * useJobItems hook for getting all job items
 *
 * ****************************************************/

export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["job-item", id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60, // 5 minutes
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    })),
  });

  const jobItems = results
    .map((result) => result.data?.jobItem)
    .filter((jobItem) => jobItem !== undefined) as TJobItemContent[];
  const isLoading = results.some((result) => result.isLoading);
  return { jobItems, isLoading } as const;
}

/*****************************************************
 * Extracting all job items for the complete list
 * With a spinner for loading in the useEffect hook
 * Also check if there is a search input. if not
 * useEffect will not run
 ****************************************************/
const fetchJobItems = async (searchText: string): Promise<JobItem[]> => {
  const response = await fetch(`${BASE_URL_API}?search=${searchText}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data.jobItems;
};

export function useSearchQuery(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 60, // 5 minutes
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText),
      onError: handleError,
    }
  );
  const isLoading = isInitialLoading;
  return { jobItems: data || [], isLoading } as const;
}

/*****************************************************
 * Debounce the search input. Which makes a fewer
 * request to the server. Default delay is 500ms
 ****************************************************/

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

/*****************************************************
 * Get the active ID from the URL without the hash
 * This will keep track if it's changed so we can
 * highlight the active job item and give it a
 * background color
 ****************************************************/
export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return activeId;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context)
    throw new Error(
      "useBookmarksContext must be used within a BookmarksContextProvider"
    );
  return context;
}

export function useActiveIdContext() {
  const context = useContext(ActiveIdContext);
  if (!context)
    throw new Error(
      "useActiveIdContext must be used within a ActiveIdContextProvider"
    );
  return context;
}

export function useSearchTextContext() {
  const context = useContext(SearchTextContext);
  if (!context)
    throw new Error(
      "useSearchTextContext must be used within a SearchTextContextProvider"
    );
  return context;
}

export function useJobItemsContext() {
  const context = useContext(JobItemsContext);
  if (!context)
    throw new Error(
      "useJobItemsContext must be used within a JobItemsContextProvider"
    );
  return context;
}

/*****************************************************
 * onButtonClick
 * **************************************************/

export function useOnClickOutside(
  refs: React.RefObject<HTMLElement>[],
  handler: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (refs.every((ref) => !ref.current?.contains(e.target as Node))) {
        handler();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [refs, handler]);
}
