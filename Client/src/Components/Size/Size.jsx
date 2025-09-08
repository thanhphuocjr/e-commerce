import React, { useState } from "react";
import "./Size.scss";
const Size = () => {
  const sizes = ["Xs", "S", "M", "L", "XL", "XXL"];
  const [selectedSize, setSelectedSize] = useState(null);
  return (
    <>
      <div className="size mb-3 mb-5">
        <h4 className="mb-0 mr-4">Size:</h4>
        <ul className="mb-0">
          {sizes.map((size) => (
            <li
              key={size}
              onClick={() => setSelectedSize(size)}
              className={selectedSize === size ? "active" : ""}
            >
              {size}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Size;
