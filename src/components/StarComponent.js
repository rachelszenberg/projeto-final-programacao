import React from "react";

export const StarComponent = (props) => {
    return (
        <div className="stars-div">
            {[...Array(7)].map((_, index) => (
            <span
              key={index}
              className={index < props.rating ? 'star filled' : 'star'}
              onClick={() => props.handleClick(index)}
            >
              ★
            </span>
          ))}
        </div>
    )
}