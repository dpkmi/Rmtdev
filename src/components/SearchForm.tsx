import { useSearchTextContext } from "../lib/hooks";

export default function SearchForm() {
  const { searchText, handleCangeSearchText } = useSearchTextContext();
  // Handle form submission
  const handleSubmit = (
    event: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  // Handle input change
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleCangeSearchText(event.target.value);
  };

  return (
    <form action="#" className="search" onSubmit={handleSubmit}>
      <button type="submit">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>

      <input
        onChange={handleOnChange}
        value={searchText}
        spellCheck="false"
        type="text"
        required
        placeholder="Find remote developer jobs..."
      />
    </form>
  );
}
