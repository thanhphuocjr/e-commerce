import React from 'react';
import './TabReviews.scss';
import Rating from '@mui/material/Rating';

const formatDate = (dateString) => {
  if (!dateString) {
    return 'Unknown date';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString();
};

const TabReviews = ({ productTitle, reviews = [], summary }) => {
  const averageRating = Number(summary?.average_rating || 0);
  const totalReviews = Number(summary?.total_reviews || reviews.length || 0);

  return (
    <div className="tableReviews">
      <h5 className="mb-3">
        {totalReviews} review{totalReviews > 1 ? 's' : ''} for{' '}
        {productTitle || 'this product'}
      </h5>

      <div className="reviewSummary mb-4">
        <Rating value={averageRating} precision={0.5} readOnly />
        <span className="ml-2 normal_text">
          Average: {averageRating.toFixed(1)} / 5
        </span>
      </div>

      <div className="public_review">
        {reviews.length === 0 && (
          <div className="reviewCard empty">No reviews yet for this product.</div>
        )}

        {reviews.map((review) => (
          <div className="reviewCard" key={review.id}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <strong>{review.reviewer_name || 'Anonymous'}</strong>
              <span className="text-light1">{formatDate(review.review_date)}</span>
            </div>

            <Rating value={Number(review.rating || 0)} readOnly size="small" className="mb-2" />

            <p className="mb-0">{review.comment || 'No comment provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabReviews;
