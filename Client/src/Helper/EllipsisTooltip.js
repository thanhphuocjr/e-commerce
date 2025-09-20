import React, { useRef, useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';

const EllipsisTooltip = ({ children }) => {
  const textRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current;
      setIsOverflow(scrollWidth > clientWidth);
    }
  }, [children]);

  return (
    <Tooltip title={isOverflow ? children : ''}>
      <span
        ref={textRef}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export default EllipsisTooltip;
