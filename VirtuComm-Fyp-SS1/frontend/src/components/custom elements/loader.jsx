import React from "react";
import styled from "styled-components";

const Loader = () => {
  return <StyledLoader />;
};

const StyledLoader = styled.div`
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background-color: rgb(40, 110, 216);;
  animation: 1.5s pulse infinite ease-in-out;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgb(40, 110, 216);;
    }
    100% {
      box-shadow: 0 0 0 8px rgba(105, 255, 168, 0);
    }
  }
`;

export default Loader;
