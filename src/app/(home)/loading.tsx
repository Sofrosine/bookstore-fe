"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
      <div
        className="circular-progress"
        style={{
          border: "3px solid #55A605",
          borderTop: "3px solid transparent",
          height: "40px",
          width: "40px",
        }}
      />
    </div>
  );
};

export default Loading;
