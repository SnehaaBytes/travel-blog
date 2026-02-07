import { useSearchParams } from "react-router-dom";

const DestinationSearch = ({ data, children }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return children(filteredData, search);
};

export default DestinationSearch;
