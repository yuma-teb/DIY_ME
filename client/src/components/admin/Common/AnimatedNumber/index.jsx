import { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, duration = 500 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp;

    const startAnimation = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = timestamp - startTimestamp;
      const percentage = Math.min(progress / duration, 1);

      setCurrentValue(Math.floor(value * percentage));

      if (progress < duration) {
        requestAnimationFrame(startAnimation);
      }
    };

    requestAnimationFrame(startAnimation);

    // Cleanup interval on component unmount
    return () => {
      setCurrentValue(value);
    };
  }, [value, duration]);

  return <span>{currentValue}</span>;
};

export default AnimatedNumber;
