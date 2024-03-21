import { useJobItemsContext } from "../lib/hooks";

export default function SortingControls() {
  const { sortBy, handleChangeSortBy } = useJobItemsContext();
  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>
      <SortButtons
        onClick={() => handleChangeSortBy("relevant")}
        isActive={sortBy === "relevant"}
      >
        Relevant
      </SortButtons>
      <SortButtons
        onClick={() => handleChangeSortBy("recent")}
        isActive={sortBy === "recent"}
      >
        {" "}
        Recent
      </SortButtons>
    </section>
  );
}

type SortingButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  isActive: boolean;
};

function SortButtons({ onClick, children, isActive }: SortingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`sorting__button sorting__button--relevant ${
        isActive ? "sorting__button--active" : ""
      }`}
    >
      {children}
    </button>
  );
}
