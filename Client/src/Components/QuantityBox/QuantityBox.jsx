import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./QuantityBox.scss"
const QuantityBox = () => {
  const [quantity, setQuantity] = useState(1);
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <Button className="decrease" onClick={handleDecrease}>
        -
      </Button>
      <div className="quantity">{quantity}</div>
      <Button className="increase" onClick={handleIncrease}>
        +
      </Button>
    </>
  );
};

export default QuantityBox;
