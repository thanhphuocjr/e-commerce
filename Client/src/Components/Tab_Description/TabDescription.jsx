import React from 'react';
import './TabDescription.scss';

const TabDescription = ({ title, description }) => {
  const paragraphs = (description || 'No description available.')
    .split(/\n+/)
    .filter(Boolean);

  return (
    <div className="desc">
      <h6>{title || 'Product description'}</h6>
      {paragraphs.map((paragraph, index) => (
        <p key={`desc-${index}`} className="des">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default TabDescription;
