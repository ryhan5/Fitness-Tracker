import React from 'react';

const FortisFitnessLogo = ({ className = "" }) => {
  return (
    <div className={`${className}`}>
      <div className="text-6xl font-black text-white flex items-baseline gap-1">
        <span className="transform rotate-180">F</span>
        <span>F</span>
      </div>
    </div>
  );
};

export default FortisFitnessLogo;