import React, { useState } from 'react';
import { Droplets, Plus } from 'lucide-react';
import { useNutri } from '../../context/NurtiContext';

const WaterTracker = ({ current, goal, onUpdate }) => {
  const { logWaterIntake } = useNutri();
  const [amount, setAmount] = useState(250);

  const percentage = Math.min((current / goal) * 100, 100);

  const addWater = async () => {
    try {
      await logWaterIntake({ amount });
      onUpdate();
    } catch (error) {
      console.error('Error logging water:', error);
    }
  };

  const quickAmounts = [250, 500, 750, 1000];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Droplets className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Water Intake</h3>
          <p className="text-sm text-gray-600">Stay hydrated!</p>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{Math.round(percentage)}%</div>
              <div className="text-xs text-gray-600">of goal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Progress */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-blue-600">{current}ml</div>
        <div className="text-sm text-gray-600">of {goal}ml goal</div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {quickAmounts.map((qty) => (
          <button
            key={qty}
            onClick={() => setAmount(qty)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              amount === qty
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {qty}ml
          </button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          placeholder="Amount (ml)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addWater}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Status Message */}
      {percentage >= 100 && (
        <div className="text-center text-green-600 font-medium">
          🎉 Daily goal achieved!
        </div>
      )}
    </div>
  );
};

export default WaterTracker;