import React from 'react';
import styled from 'styled-components';

const ConfigButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="setting-btn" onClick={onClick}>
        <span className="bar bar1" />
        <span className="bar bar2" />
        <span className="bar bar1" />
      </button>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  .setting-btn {
    width: 45px;
    height: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: rgb(40, 110, 216);
    border-radius: 10px;
    cursor: pointer;
    border: none;
    box-shadow: 6px 6px 12px rgb(0, 50, 110);
  }
  .bar {
    width: 50%;
    height: 2px;
    background-color: rgb(229, 229, 229);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 2px;
  }
  .bar::before {
    content: "";
    width: 2px;
    height: 2px;
    background-color: rgb(126, 117, 255);
    position: absolute;
    border-radius: 50%;
    border: 2px solid white;
    transition: all 0.3s;
    box-shadow: 0px 0px 5px white;
  }
  .bar1::before {
    transform: translateX(-4px);
  }
  .bar2::before {
    transform: translateX(4px);
  }
  .setting-btn:hover .bar1::before {
    transform: translateX(4px);
  }
  .setting-btn:hover .bar2::before {
    transform: translateX(-4px);
  }`;

export default ConfigButton;
