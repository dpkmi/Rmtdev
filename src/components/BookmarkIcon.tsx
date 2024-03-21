import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useBookmarksContext } from "../lib/hooks";

type BookmarkIconsProps = {
  id: number;
};

export default function BookmarkIcon({ id }: BookmarkIconsProps) {
  const { bookmarkedIDs, handleToggleBookmark } = useBookmarksContext();

  return (
    <button
      onClick={(e) => {
        handleToggleBookmark(id);
        e.stopPropagation();
        e.preventDefault();
      }}
      className="bookmark-btn"
    >
      <BookmarkFilledIcon
        className={`${bookmarkedIDs.includes(id) ? "filled" : ""}`}
      />
    </button>
  );
}
