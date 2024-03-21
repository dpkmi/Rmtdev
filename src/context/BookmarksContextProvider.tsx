import { createContext } from "react";
import { useJobItems, useLocalStorage } from "../lib/hooks";
import { TJobItemContent } from "../lib/types";

type BookmarksContext = {
  bookmarkedIDs: number[];
  handleToggleBookmark: (id: number) => void;
  bookmarkedJobItems: TJobItemContent[];
  isLoading: boolean;
};

export const BookmarksContext = createContext<BookmarksContext | null>(null);

export default function BookmarksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookmarkedIDs, setBookmarkedIDs] = useLocalStorage<number[]>(
    "bookmarkedIDs",
    []
  );

  const { jobItems: bookmarkedJobItems, isLoading } =
    useJobItems(bookmarkedIDs);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkedIDs.includes(id)) {
      setBookmarkedIDs((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkedIDs((prev) => [...prev, id]);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIDs,
        bookmarkedJobItems,
        isLoading,
        handleToggleBookmark,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
