import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz', 'lb']
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  macros: {
    protein: {
      type: Number,
      required: true,
      min: 0
    },
    carbs: {
      type: Number,
      required: true,
      min: 0
    },
    fat: {
      type: Number,
      required: true,
      min: 0
    },
    fiber: {
      type: Number,
      required: true,
      min: 0
    }
  }
});

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  foods: [foodSchema],
  totalCalories: {
    type: Number,
    required: true,
    min: 0
  },
  timing: {
    type: Date,
    default: Date.now
  }
});

const nutritionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  meals: [mealSchema],
  waterIntake: {
    type: Number,
    default: 0,
    min: 0 // in ml
  },
  dailyGoals: {
    calories: {
      type: Number,
      required: true,
      default: 2000
    },
    protein: {
      type: Number,
      required: true,
      default: 150 // in grams
    },
    carbs: {
      type: Number,
      required: true,
      default: 250 // in grams
    },
    fat: {
      type: Number,
      required: true,
      default: 67 // in grams
    },
    water: {
      type: Number,
      required: true,
      default: 2000 // in ml
    }
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
nutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Virtual for daily totals
nutritionLogSchema.virtual('dailyTotals').get(function() {
  const totals = this.meals.reduce((acc, meal) => {
    acc.calories += meal.totalCalories;
    meal.foods.forEach(food => {
      acc.protein += food.macros.protein;
      acc.carbs += food.macros.carbs;
      acc.fat += food.macros.fat;
      acc.fiber += food.macros.fiber;
    });
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  return {
    ...totals,
    water: this.waterIntake
  };
});

// Method to calculate meal totals before saving
mealSchema.pre('save', function(next) {
  if (this.foods && this.foods.length > 0) {
    this.totalCalories = this.foods.reduce((total, food) => total + food.calories, 0);
  }
  next();
});

// Static method to find or create daily log
nutritionLogSchema.statics.findOrCreateDailyLog = async function(userId, date = new Date()) {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  let log = await this.findOne({ userId, date: startOfDay });
  
  if (!log) {
    log = new this({
      userId,
      date: startOfDay,
      meals: [],
      waterIntake: 0
    });
    await log.save();
  }
  
  return log;
};

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

export default NutritionLog;