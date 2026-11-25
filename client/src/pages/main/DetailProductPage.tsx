import { Link } from "react-router";

const DetailProductPage = () => {
  return (
    <div>
      {/* Page Hero */}
      <div className="breadcrumbs text-sm mb-2">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Product</Link>
          </li>
          <li>
            <span className="font-semibold pointer-events-none">
              Kingston Fury Beast 16GB DDR4 RAM
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailProductPage;
