import React from "react";
import "./animatedBackground.css"; // Ensure to create and import the CSS file

const AnimatedBackground = () => {
  return (
    <div className="wrapper">
      <div className="box">
        {[...Array(10)].map((_, index) => (
          <div key={index}></div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
