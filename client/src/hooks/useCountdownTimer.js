import { useState, useEffect } from "react";

const useCountdownTimer = (serverTime, sessionDuration = 3600000) => {
  const [timeLeft, setTimeLeft] = useState(sessionDuration); // Default 1 hour (in ms)

  useEffect(() => {
    if (serverTime) {
      // Calculate the time left based on the server's time
      const startTime = new Date(serverTime).getTime();
      const now = Date.now();
      const timePassed = now - startTime;

      // Set the remaining time (sessionDuration - time passed)
      const remainingTime = sessionDuration - timePassed;
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }
  }, [serverTime, sessionDuration]);

  const extendTime = () => {
    setTimeLeft(sessionDuration); // Reset to full session duration (1 hour)
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1000 : 0));
      }, 1000);

      return () => clearInterval(timerId); // Cleanup the timer on unmount
    }
  }, [timeLeft]);

  return { timeLeft, extendTime, isExpired: timeLeft === 0 };
};

export default useCountdownTimer;
