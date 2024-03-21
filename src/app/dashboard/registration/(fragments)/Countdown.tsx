"use client";

import React, { useState, useEffect } from "react";

const Countdown = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-07-20") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const currentDate = new Date();
  const endDate = new Date("2024-07-20");

  return currentDate <= endDate ? (
    <div className="flex items-center gap-6 justify-center">
      <div className="bg-primary px-6 py-3 text-subtitle-3 text-white font-bold">
        Early Price
      </div>
      <div className="flex gap-2">
        <div className="text-primary text-center">
          <p className="text-subtitle-3 font-bold">{timeLeft?.days}</p>
          <p className="text-body-2">Days</p>
        </div>
        <div className="text-subtitle-3 text-primary font-bold">:</div>
        <div className="text-primary text-center">
          <p className="text-subtitle-3 font-bold">{timeLeft?.hours}</p>
          <p className="text-body-2">Hours</p>
        </div>
        <div className="text-subtitle-3 text-primary font-bold">:</div>
        <div className="text-primary text-center">
          <p className="text-subtitle-3 font-bold">{timeLeft?.minutes}</p>
          <p className="text-body-2">Minutes</p>
        </div>
        <div className="text-subtitle-3 text-primary font-bold">:</div>
        <div className="text-primary text-center">
          <p className="text-subtitle-3 font-bold">{timeLeft?.seconds}</p>
          <p className="text-body-2">Seconds</p>
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

export default Countdown;
