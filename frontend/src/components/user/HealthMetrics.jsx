import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Save, Activity, Weight, Ruler, Heart, Target, TrendingUp } from 'lucide-react';

const HealthMetrics = ({ healthMetrics }) => {
  const { updateHealthMetrics, loading } = useUser();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    targetWeight: '',
    bodyFat: '',
    muscleMass: '',
    restingHeartRate: '',
    maxHeartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    fitnessLevel: '',
    activityLevel: '',
    healthGoals: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (healthMetrics) {
      setFormData({
        height: healthMetrics.height || '',
        weight: healthMetrics.weight || '',
        targetWeight: healthMetrics.targetWeight || '',
        bodyFat: healthMetrics.bodyFat || '',
        muscleMass: healthMetrics.muscleMass || '',
        restingHeartRate: healthMetrics.restingHeartRate || '',
        maxHeartRate: healthMetrics.maxHeartRate || '',
        bloodPressureSystolic: healthMetrics.bloodPressureSystolic || '',
        bloodPressureDiastolic: healthMetrics.bloodPressureDiastolic || '',
        fitnessLevel: healthMetrics.fitnessLevel || '',
        activityLevel: healthMetrics.activityLevel || '',
        healthGoals: healthMetrics.healthGoals || []
      });
    }
  }, [healthMetrics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGoalChange = (goal) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.height && (formData.height < 100 || formData.height > 250)) {
      newErrors.height = 'Height must be between 100-250 cm';
    }
    
    if (formData.weight && (formData.weight < 30 || formData.weight > 300)) {
      newErrors.weight = 'Weight must be between 30-300 kg';
    }
    
    if (formData.restingHeartRate && (formData.restingHeartRate < 40 || formData.restingHeartRate > 100)) {
      newErrors.restingHeartRate = 'Resting heart rate must be between 40-100 bpm';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await updateHealthMetrics(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating health metrics:', error);
    }
  };

  const handleCancel = () => {
    if (healthMetrics) {
      setFormData({
        height: healthMetrics.height || '',
        weight: healthMetrics.weight || '',
        targetWeight: healthMetrics.targetWeight || '',
        bodyFat: healthMetrics.bodyFat || '',
        muscleMass: healthMetrics.muscleMass || '',
        restingHeartRate: healthMetrics.restingHeartRate || '',
        maxHeartRate: healthMetrics.maxHeartRate || '',
        bloodPressureSystolic: healthMetrics.bloodPressureSystolic || '',
        bloodPressureDiastolic: healthMetrics.bloodPressureDiastolic || '',
        fitnessLevel: healthMetrics.fitnessLevel || '',
        activityLevel: healthMetrics.activityLevel || '',
        healthGoals: healthMetrics.healthGoals || []
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const healthGoalOptions = [
    'Weight Loss',
    'Weight Gain',
    'Muscle Building',
    'Cardiovascular Health',
    'Strength Training',
    'Flexibility',
    'Endurance',
    'General Fitness'
  ];

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Health Metrics</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Activity className="h-4 w-4 mr-1" />
              Edit Metrics
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-1" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* BMI Card */}
        {bmi && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Body Mass Index</h3>
                <p className="text-sm text-gray-600">Based on your height and weight</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{bmi}</div>
                <div className={`text-sm font-medium ${bmiInfo.color}`}>
                  {bmiInfo.category}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Physical Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Metrics</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Ruler className="inline h-4 w-4 mr-1" />
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="170"
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Weight className="inline h-4 w-4 mr-1" />
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="70"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline h-4 w-4 mr-1" />
                Target Weight (kg)
              </label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.targetWeight ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Fat (%)
              </label>
              <input
                type="number"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.bodyFat ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muscle Mass (kg)
              </label>
              <input
                type="number"
                name="muscleMass"
                value={formData.muscleMass}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.muscleMass ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="35"
              />
            </div>
          </div>
        </div>

        {/* Cardiovascular Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cardiovascular Health</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="inline h-4 w-4 mr-1" />
                Resting HR (bpm)
              </label>
              <input
                type="number"
                name="restingHeartRate"
                value={formData.restingHeartRate}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.restingHeartRate ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="60"
              />
              {errors.restingHeartRate && (
                <p className="mt-1 text-sm text-red-600">{errors.restingHeartRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max HR (bpm)
              </label>
              <input
                type="number"
                name="maxHeartRate"
                value={formData.maxHeartRate}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.maxHeartRate ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="180"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BP Systolic (mmHg)
              </label>
              <input
                type="number"
                name="bloodPressureSystolic"
                value={formData.bloodPressureSystolic}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.bloodPressureSystolic ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BP Diastolic (mmHg)
              </label>
              <input
                type="number"
                name="bloodPressureDiastolic"
                value={formData.bloodPressureDiastolic}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.bloodPressureDiastolic ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="80"
              />
            </div>
          </div>
        </div>

        {/* Fitness Level */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fitness Assessment</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="inline h-4 w-4 mr-1" />
                Fitness Level
              </label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.fitnessLevel ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select fitness level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } ${errors.activityLevel ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="lightly-active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very-active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely-active">Extremely Active (very hard exercise, physical job)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Health Goals</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {healthGoalOptions.map((goal) => (
              <label key={goal} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.healthGoals.includes(goal)}
                  onChange={() => handleGoalChange(goal)}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">{goal}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthMetrics;