import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './QuantityBox.scss';

const QuantityBox = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  const [internalQuantity, setInternalQuantity] = useState(value || min);
  const quantity = value ?? internalQuantity;

  const updateQuantity = (nextQuantity) => {
    const boundedQuantity = Math.min(max, Math.max(min, nextQuantity));

    if (value === undefined) {
      setInternalQuantity(boundedQuantity);
    }

    onChange?.(boundedQuantity);
  };

  const handleDecrease = () => {
    updateQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(quantity + 1);
  };

  return (
    <>
      <Button className="decrease" onClick={handleDecrease} disabled={disabled}>
        -
      </Button>
      <div className="quantity">{quantity}</div>
      <Button className="increase" onClick={handleIncrease} disabled={disabled}>
        +
      </Button>
    </>
  );
};

export default QuantityBox;
