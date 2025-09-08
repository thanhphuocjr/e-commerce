import React from "react";
import Rating from "@mui/material/Rating";
import "./UserReview.scss";

import avatar1 from "../../assets/images/Avatar/avataphuoc.jpg";

const UserReview = () => {
  return (
    <div>
      <div className="d-flex w-100  userReview mb-4">
        <div className="avatar mr-3">
          <img src={avatar1} alt="" />
        </div>

        <div className="rating">
          <div className="d-flex info align-items-center ">
            <div className="name">
              <strong>Nguyen Thanh Phuoc (admin)</strong>
            </div>
            <div className="time text-light1">- July 26, 2025</div>
          </div>
          <Rating
            name="read-only"
            value={3}
            readOnly
            size="small"
            className="mb-2"
          />
          <span className="comment">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae ipsam
            aliquid, consequatur repellendus vitae repellat facilis alias
            voluptates quia nemo, ad odit, itaque et amet labore esse. Officia,
            nulla consequuntur.
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
