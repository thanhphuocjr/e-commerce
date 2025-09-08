import React from "react";
import "./TabReviews.scss";
import UserReview from "../UserReview/UserReview";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import avatar1 from "../../assets/images/Avatar/avataphuoc.jpg";
const TableReviews = () => {
  const [value, setValue] = React.useState(2);
  return (
    <div className="tableReviews">
      <h5 className="mb-4"> 2 Reviews for Natural VietNam-Style Clothes</h5>

      <div className="public_review  ">
        <UserReview />
        <UserReview />
        <UserReview />
        <UserReview />
        <UserReview />
      </div>
      <hr />
      <div className="private_review mb-5">
        <div>
          <strong>Add your review</strong>
        </div>
        <span className="note mt-2 mb-1">
          <strong>Note:</strong> Your email address will not be published.
          Required fields are marked *
        </span>
        <div className="d-flex w-100  userReview mb-4 ">
          <div className="avatar mr-3">
            <img src={avatar1} alt="" />
          </div>

          <div className="rating w-100">
            <div className="d-flex info align-items-center mb-2">
              <div className="name mb-1">
                <strong>Nguyen Thanh Phuoc (User)</strong>
              </div>
            </div>
            <div className="rate d-flex align-items-center mb-2">
              <Typography component="legend">
                <strong>*Rating:</strong>
              </Typography>
              <Rating
                name="simple-controlled"
                value={value}
                size="medium"
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </div>
            <Typography component="legend" className="mb-2">
              <strong>*Your review:</strong>
            </Typography>
            <textarea
              placeholder="Write your review..."
              name="text"
              id=""
              className="text_area mb-3"
            ></textarea>
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableReviews;
