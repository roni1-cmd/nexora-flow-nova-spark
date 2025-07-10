
import React from 'react';

const CustomLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          position: relative;
          width: 2.5em;
          height: 2.5em;
          transform: rotate(165deg);
        }

        .loader:before, .loader:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          width: 0.5em;
          height: 0.5em;
          border-radius: 0.25em;
          transform: translate(-50%, -50%);
        }

        .loader:before {
          animation: before8 2s infinite;
        }

        .loader:after {
          animation: after6 2s infinite;
        }

        @keyframes before8 {
          0% {
            width: 0.5em;
            box-shadow: 1em -0.5em rgba(219, 39, 119, 0.75), -1em 0.5em rgba(59, 130, 246, 0.75);
          }
          35% {
            width: 2.5em;
            box-shadow: 0 -0.5em rgba(219, 39, 119, 0.75), 0 0.5em rgba(59, 130, 246, 0.75);
          }
          70% {
            width: 0.5em;
            box-shadow: -1em -0.5em rgba(219, 39, 119, 0.75), 1em 0.5em rgba(59, 130, 246, 0.75);
          }
          100% {
            box-shadow: 1em -0.5em rgba(219, 39, 119, 0.75), -1em 0.5em rgba(59, 130, 246, 0.75);
          }
        }

        @keyframes after6 {
          0% {
            height: 0.5em;
            box-shadow: 0.5em 1em rgba(147, 51, 234, 0.75), -0.5em -1em rgba(139, 92, 246, 0.75);
          }
          35% {
            height: 2.5em;
            box-shadow: 0.5em 0 rgba(147, 51, 234, 0.75), -0.5em 0 rgba(139, 92, 246, 0.75);
          }
          70% {
            height: 0.5em;
            box-shadow: 0.5em -1em rgba(147, 51, 234, 0.75), -0.5em 1em rgba(139, 92, 246, 0.75);
          }
          100% {
            box-shadow: 0.5em 1em rgba(147, 51, 234, 0.75), -0.5em -1em rgba(139, 92, 246, 0.75);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomLoader;
