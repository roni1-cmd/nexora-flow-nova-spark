import React from 'react';
import styled from 'styled-components';

const EssayLoader = () => {
  return (
    <StyledWrapper>
      <div className="scene">
        <div className="forest">
          <div className="tree tree1">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
          </div>
          <div className="tree tree2">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
            <div className="branch branch-bottom" />
          </div>
          <div className="tree tree3">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
            <div className="branch branch-bottom" />
          </div>
          <div className="tree tree4">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
            <div className="branch branch-bottom" />
          </div>
          <div className="tree tree5">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
            <div className="branch branch-bottom" />
          </div>
          <div className="tree tree6">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
            <div className="branch branch-bottom" />
          </div>
          <div className="tree tree7">
            <div className="branch branch-top" />
            <div className="branch branch-middle" />
            <div className="branch branch-bottom" />
          </div>
        </div>
        <div className="tent">
          <div className="roof" />
          <div className="roof-border-left">
            <div className="roof-border roof-border1" />
            <div className="roof-border roof-border2" />
            <div className="roof-border roof-border3" />
          </div>
          <div className="entrance">
            <div className="door left-door">
              <div className="left-door-inner" />
            </div>
            <div className="door right-door">
              <div className="right-door-inner" />
            </div>
          </div>
        </div>
        <div className="floor">
          <div className="ground ground1" />
          <div className="ground ground2" />
        </div>
        <div className="fireplace">
          <div className="support" />
          <div className="support" />
          <div className="bar" />
          <div className="hanger" />
          <div className="smoke" />
          <div className="pan" />
          <div className="fire">
            <div className="line line1">
              <div className="particle particle1" />
              <div className="particle particle2" />
              <div className="particle particle3" />
              <div className="particle particle4" />
            </div>
            <div className="line line2">
              <div className="particle particle1" />
              <div className="particle particle2" />
              <div className="particle particle3" />
              <div className="particle particle4" />
            </div>
            <div className="line line3">
              <div className="particle particle1" />
              <div className="particle particle2" />
              <div className="particle particle3" />
              <div className="particle particle4" />
            </div>
          </div>
        </div>
        <div className="time-wrapper">
          <div className="time">
            <div className="day" />
            <div className="night">
              <div className="moon" />
              <div className="star star1 star-big" />
              <div className="star star2 star-big" />
              <div className="star star3 star-big" />
              <div className="star star4" />
              <div className="star star5" />
              <div className="star star6" />
              <div className="star star7" />
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  @keyframes stageBackground {
    0%, 10%, 90%, 100% {
      background-color: #8B5CF6;
    }
    25%, 75% {
      background-color: #A855F7;
    }
  }

  @keyframes earthRotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sunrise {
    0%, 10%, 90%, 100% {
      box-shadow: 0 0 0 25px #EC4899, 0 0 0 40px #F472B6, 0 0 0 60px rgba(244, 114, 182, 0.6), 0 0 0 90px rgba(244, 114, 182, 0.3);
    }
    25%, 75% {
      box-shadow: 0 0 0 0 #EC4899, 0 0 0 0 #F472B6, 0 0 0 0 rgba(244, 114, 182, 0.6), 0 0 0 0 rgba(244, 114, 182, 0.3);
    }
  }

  @keyframes moonOrbit {
    25% {
      transform: rotate(-60deg);
    }
    50% {
      transform: rotate(-60deg);
    }
    75% {
      transform: rotate(-120deg);
    }
    0%, 100% {
      transform: rotate(-180deg);
    }
  }

  @keyframes nightTime {
    0%, 90% {
      opacity: 0;
    }
    50%, 75% {
      opacity: 1;
    }
  }

  @keyframes hotPan {
    0%, 90% {
      background-color: #7C3AED;
    }
    50%, 75% {
      background-color: #EC4899;
    }
  }

  @keyframes heat {
    0%, 90% {
      box-shadow: inset 0 0 0 0 rgba(139, 92, 246, 0.3);
    }
    50%, 75% {
      box-shadow: inset 0 -2px 0 0 #F472B6;
    }
  }

  @keyframes smoke {
    0%, 50%, 90%, 100% {
      opacity: 0;
    }
    50%, 75% {
      opacity: 0.7;
    }
  }

  @keyframes fire {
    0%, 90%, 100% {
      opacity: 0;
    }
    50%, 75% {
      opacity: 1;
    }
  }

  @keyframes treeShake {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-2deg);
    }
    40% {
      transform: rotate(4deg);
    }
    50% {
      transform: rotate(-4deg);
    }
    60% {
      transform: rotate(6deg);
    }
    75% {
      transform: rotate(-6deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes fireParticles {
    0% {
      height: 30%;
      opacity: 1;
      top: 75%;
    }
    25% {
      height: 25%;
      opacity: 0.8;
      top: 40%;
    }
    50% {
      height: 15%;
      opacity: 0.6;
      top: 20%;
    }
    75% {
      height: 10%;
      opacity: 0.3;
      top: 0;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes fireLines {
    0%, 25%, 75%, 100% {
      bottom: 0;
    }
    50% {
      bottom: 5%;
    }
  }

  .scene {
    display: flex;
    margin: 0 auto 80px auto;
    justify-content: center;
    align-items: flex-end;
    width: 400px;
    height: 300px;
    position: relative;
  }

  .forest {
    display: flex;
    width: 75%;
    height: 90%;
    position: relative;
  }

  .tree {
    display: block;
    width: 50%;
    position: absolute;
    bottom: 0;
    opacity: 0.6;
  }

  .tree .branch {
    width: 80%;
    height: 0;
    margin: 0 auto;
    padding-left: 40%;
    padding-bottom: 50%;
    overflow: hidden;
  }

  .tree .branch:before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    margin-left: -600px;
    border-left: 600px solid transparent;
    border-right: 600px solid transparent;
    border-bottom: 950px solid #3B82F6;
  }

  .tree .branch.branch-top {
    transform-origin: 50% 100%;
    animation: treeShake 0.5s linear infinite;
  }

  .tree .branch.branch-middle {
    width: 90%;
    padding-left: 45%;
    padding-bottom: 65%;
    margin: 0 auto;
    margin-top: -25%;
  }

  .tree .branch.branch-bottom {
    width: 100%;
    padding-left: 50%;
    padding-bottom: 80%;
    margin: 0 auto;
    margin-top: -40%;
  }

  .tree1 { width: 31%; }
  .tree1 .branch-top { transition-delay: 0.3s; }
  .tree2 { width: 39%; left: 9%; }
  .tree2 .branch-top { transition-delay: 0.4s; }
  .tree3 { width: 32%; left: 24%; }
  .tree3 .branch-top { transition-delay: 0.5s; }
  .tree4 { width: 37%; left: 34%; }
  .tree4 .branch-top { transition-delay: 0.6s; }
  .tree5 { width: 44%; left: 44%; }
  .tree5 .branch-top { transition-delay: 0.7s; }
  .tree6 { width: 34%; left: 61%; }
  .tree6 .branch-top { transition-delay: 0.2s; }
  .tree7 { width: 24%; left: 76%; }
  .tree7 .branch-top { transition-delay: 0.1s; }

  .tent {
    width: 60%;
    height: 25%;
    position: absolute;
    bottom: -0.5%;
    right: 15%;
    z-index: 1;
    text-align: right;
  }

  .roof {
    display: inline-block;
    width: 45%;
    height: 100%;
    margin-right: 10%;
    position: relative;
    z-index: 1;
    border-top: 4px solid #7C3AED;
    border-right: 4px solid #7C3AED;
    border-left: 4px solid #7C3AED;
    border-top-right-radius: 6px;
    transform: skew(30deg);
    box-shadow: inset -3px 3px 0px 0px #A855F7;
    background: #8B5CF6;
  }

  .roof:before {
    content: "";
    width: 70%;
    height: 70%;
    position: absolute;
    top: 15%;
    left: 15%;
    z-index: 0;
    border-radius: 10%;
    background-color: #EC4899;
  }

  .roof:after {
    content: "";
    height: 75%;
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(236, 72, 153, 0.4) 0%, rgba(236, 72, 153, 0.4) 64%, rgba(236, 72, 153, 0.8) 65%, rgba(236, 72, 153, 0.8) 100%);
  }

  .roof-border-left {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 1%;
    height: 125%;
    position: absolute;
    top: 0;
    left: 35.7%;
    z-index: 1;
    transform-origin: 50% 0%;
    transform: rotate(35deg);
  }

  .roof-border-left .roof-border {
    display: block;
    width: 100%;
    border-radius: 2px;
    border: 2px solid #7C3AED;
  }

  .roof-border-left .roof-border1 { height: 40%; }
  .roof-border-left .roof-border2 { height: 10%; }
  .roof-border-left .roof-border3 { height: 40%; }

  .door {
    width: 55px;
    height: 92px;
    position: absolute;
    bottom: 2%;
    overflow: hidden;
    z-index: 0;
    transform-origin: 0 105%;
  }

  .left-door {
    transform: rotate(35deg);
    position: absolute;
    left: 13.5%;
    bottom: -3%;
    z-index: 0;
  }

  .left-door .left-door-inner {
    width: 100%;
    height: 100%;
    transform-origin: 0 105%;
    transform: rotate(-35deg);
    position: absolute;
    top: 0;
    overflow: hidden;
    background-color: #DDD6FE;
  }

  .left-door .left-door-inner:before {
    content: "";
    width: 15%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background: repeating-linear-gradient(#C4B5FD, #C4B5FD 4%, #DDD6FE 5%, #DDD6FE 10%);
  }

  .left-door .left-door-inner:after {
    content: "";
    width: 50%;
    height: 100%;
    position: absolute;
    top: 15%;
    left: 10%;
    transform: rotate(25deg);
    background-color: #F3E8FF;
  }

  .right-door {
    height: 89px;
    right: 21%;
    transform-origin: 0 105%;
    transform: rotate(-30deg) scaleX(-1);
    position: absolute;
    bottom: -3%;
    z-index: 0;
  }

  .right-door .right-door-inner {
    width: 100%;
    height: 100%;
    transform-origin: 0 120%;
    transform: rotate(-30deg);
    position: absolute;
    bottom: 0px;
    overflow: hidden;
    background-color: #FDF2F8;
  }

  .right-door .right-door-inner:before {
    content: "";
    width: 50%;
    height: 100%;
    position: absolute;
    top: 15%;
    right: -28%;
    z-index: 1;
    transform: rotate(15deg);
    background-color: #7C3AED;
  }

  .right-door .right-door-inner:after {
    content: "";
    width: 50%;
    height: 100%;
    position: absolute;
    top: 15%;
    right: -20%;
    transform: rotate(20deg);
    background-color: #F9A8D4;
  }

  .floor {
    width: 80%;
    position: absolute;
    right: 10%;
    bottom: 0;
    z-index: 1;
  }

  .floor .ground {
    position: absolute;
    border-radius: 2px;
    border: 2px solid #7C3AED;
  }

  .floor .ground.ground1 {
    width: 65%;
    left: 0;
  }

  .floor .ground.ground2 {
    width: 30%;
    right: 0;
  }

  .fireplace {
    display: block;
    width: 24%;
    height: 20%;
    position: absolute;
    left: 5%;
  }

  .fireplace:before {
    content: "";
    display: block;
    width: 8%;
    position: absolute;
    bottom: -4px;
    left: 2%;
    border-radius: 2px;
    border: 2px solid #7C3AED;
    background: #7C3AED;
  }

  .fireplace .support {
    display: block;
    height: 105%;
    width: 2px;
    position: absolute;
    bottom: -5%;
    left: 10%;
    border: 2px solid #7C3AED;
  }

  .fireplace .support:before {
    content: "";
    width: 100%;
    height: 15%;
    position: absolute;
    top: -18%;
    left: -4px;
    border-radius: 2px;
    border: 2px solid #7C3AED;
    transform-origin: 100% 100%;
    transform: rotate(45deg);
  }

  .fireplace .support:after {
    content: "";
    width: 100%;
    height: 15%;
    position: absolute;
    top: -18%;
    left: 0px;
    border-radius: 2px;
    border: 2px solid #7C3AED;
    transform-origin: 0 100%;
    transform: rotate(-45deg);
  }

  .fireplace .support:nth-child(1) {
    left: 85%;
  }

  .fireplace .bar {
    width: 100%;
    height: 2px;
    border-radius: 2px;
    border: 2px solid #7C3AED;
  }

  .fireplace .hanger {
    display: block;
    width: 2px;
    height: 25%;
    margin-left: -4px;
    position: absolute;
    left: 50%;
    border: 2px solid #7C3AED;
  }

  .fireplace .pan {
    display: block;
    width: 25%;
    height: 50%;
    border-radius: 50%;
    border: 4px solid #7C3AED;
    position: absolute;
    top: 25%;
    left: 35%;
    overflow: hidden;
    animation: heat 5s linear infinite;
  }

  .fireplace .pan:before {
    content: "";
    display: block;
    height: 53%;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: -1;
    border-top: 4px solid #7C3AED;
    background-color: #7C3AED;
    animation: hotPan 5s linear infinite;
  }

  .fireplace .smoke {
    display: block;
    width: 20%;
    height: 25%;
    position: absolute;
    top: 25%;
    left: 37%;
    background-color: #F472B6;
    filter: blur(5px);
    animation: smoke 5s linear infinite;
  }

  .fireplace .fire {
    display: block;
    width: 25%;
    height: 120%;
    position: absolute;
    bottom: 0;
    left: 33%;
    z-index: 1;
    animation: fire 5s linear infinite;
  }

  .fireplace .fire:before {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    position: absolute;
    bottom: -4px;
    z-index: 1;
    border-radius: 2px;
    border: 1px solid #EC4899;
    background-color: #EC4899;
  }

  .fireplace .fire .line {
    display: block;
    width: 2px;
    height: 100%;
    position: absolute;
    bottom: 0;
    animation: fireLines 1s linear infinite;
  }

  .fireplace .fire .line2 {
    left: 50%;
    margin-left: -1px;
    animation-delay: 0.3s;
  }

  .fireplace .fire .line3 {
    right: 0;
    animation-delay: 0.5s;
  }

  .fireplace .fire .line .particle {
    height: 10%;
    position: absolute;
    top: 100%;
    z-index: 1;
    border-radius: 2px;
    border: 2px solid #EC4899;
    animation: fireParticles 0.5s linear infinite;
  }

  .fireplace .fire .line .particle1 { animation-delay: 0.1s; }
  .fireplace .fire .line .particle2 { animation-delay: 0.3s; }
  .fireplace .fire .line .particle3 { animation-delay: 0.6s; }
  .fireplace .fire .line .particle4 { animation-delay: 0.9s; }

  .time-wrapper {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
  }

  .time {
    display: block;
    width: 100%;
    height: 200%;
    position: absolute;
    transform-origin: 50% 50%;
    transform: rotate(270deg);
    animation: earthRotation 5s linear infinite;
  }

  .time .day {
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 20%;
    left: 40%;
    border-radius: 50%;
    box-shadow: 0 0 0 25px #EC4899, 0 0 0 40px #F472B6, 0 0 0 60px rgba(244, 114, 182, 0.6), 0 0 0 90px rgba(244, 114, 182, 0.3);
    animation: sunrise 5s ease-in-out infinite;
    background-color: #3B82F6;
  }

  .time .night {
    animation: nightTime 5s ease-in-out infinite;
  }

  .time .night .star {
    display: block;
    width: 4px;
    height: 4px;
    position: absolute;
    bottom: 10%;
    border-radius: 50%;
    background-color: #F472B6;
  }

  .time .night .star-big {
    width: 6px;
    height: 6px;
  }

  .time .night .star1 { right: 23%; bottom: 25%; }
  .time .night .star2 { right: 35%; bottom: 18%; }
  .time .night .star3 { right: 47%; bottom: 25%; }
  .time .night .star4 { right: 22%; bottom: 20%; }
  .time .night .star5 { right: 18%; bottom: 30%; }
  .time .night .star6 { right: 60%; bottom: 20%; }
  .time .night .star7 { right: 70%; bottom: 23%; }

  .time .night .moon {
    display: block;
    width: 25px;
    height: 25px;
    position: absolute;
    bottom: 22%;
    right: 33%;
    border-radius: 50%;
    transform: rotate(-60deg);
    box-shadow: 9px 9px 3px 0 #F472B6;
    filter: blur(1px);
    animation: moonOrbit 5s ease-in-out infinite;
  }

  .time .night .moon:before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: -9px;
    left: 9px;
    border-radius: 50%;
    box-shadow: 0 0 0 5px rgba(244, 114, 182, 0.05), 0 0 0 15px rgba(244, 114, 182, 0.05), 0 0 0 25px rgba(244, 114, 182, 0.05), 0 0 0 35px rgba(244, 114, 182, 0.05);
    background-color: rgba(244, 114, 182, 0.2);
  }
`;

export default EssayLoader;
