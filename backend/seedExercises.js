import { Exercise } from './src/models/workout.model.js';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleExercises = [
  // Strength - Chest
  {
    name: "Push-ups",
    category: "strength",
    targetMuscles: ["chest", "triceps", "shoulders"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "A basic bodyweight exercise that targets chest, shoulders, and triceps",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulders",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your body in a straight line throughout"
    ],
    tips: ["Engage your core", "Don't let hips sag", "Control the movement"],
    caloriesPerMinute: 8
  },
  {
    name: "Bench Press",
    category: "strength",
    targetMuscles: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    difficulty: "intermediate",
    description: "Classic chest exercise using barbell and bench",
    instructions: [
      "Lie on bench with feet flat on floor",
      "Grip barbell slightly wider than shoulders",
      "Lower bar to chest with control",
      "Press bar back to starting position"
    ],
    tips: ["Keep shoulders back", "Don't bounce bar off chest", "Use spotter for heavy weights"],
    caloriesPerMinute: 6
  },
  
  // Strength - Back
  {
    name: "Pull-ups",
    category: "strength",
    targetMuscles: ["back", "biceps"],
    equipment: ["pull-up-bar"],
    difficulty: "intermediate",
    description: "Upper body pulling exercise targeting back and biceps",
    instructions: [
      "Hang from pull-up bar with overhand grip",
      "Pull body up until chin clears the bar",
      "Lower with control to full arm extension",
      "Repeat for desired reps"
    ],
    tips: ["Engage lats", "Don't swing", "Full range of motion"],
    caloriesPerMinute: 10
  },
  {
    name: "Bent-over Rows",
    category: "strength",
    targetMuscles: ["back", "biceps"],
    equipment: ["dumbbells"],
    difficulty: "intermediate",
    description: "Compound back exercise using dumbbells",
    instructions: [
      "Hinge at hips with slight knee bend",
      "Hold dumbbells with arms extended",
      "Pull elbows back, squeezing shoulder blades",
      "Lower with control"
    ],
    tips: ["Keep back straight", "Lead with elbows", "Squeeze at the top"],
    caloriesPerMinute: 7
  },
  
  // Strength - Legs
  {
    name: "Squats",
    category: "strength",
    targetMuscles: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "Fundamental lower body exercise",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower hips back and down as if sitting",
      "Keep chest up and knees behind toes",
      "Push through heels to return to standing"
    ],
    tips: ["Keep weight on heels", "Don't let knees cave in", "Go as low as comfortable"],
    caloriesPerMinute: 8
  },
  {
    name: "Deadlifts",
    category: "strength",
    targetMuscles: ["hamstrings", "glutes", "back"],
    equipment: ["barbell"],
    difficulty: "advanced",
    description: "Compound exercise targeting posterior chain",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip bar",
      "Keep chest up, back straight",
      "Drive through heels to stand up straight"
    ],
    tips: ["Keep bar close to body", "Engage core", "Don't round back"],
    caloriesPerMinute: 10
  },
  
  // Strength - Core
  {
    name: "Plank",
    category: "strength",
    targetMuscles: ["core", "abs"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "Isometric core strengthening exercise",
    instructions: [
      "Start in push-up position",
      "Lower to forearms",
      "Keep body in straight line",
      "Hold position for desired time"
    ],
    tips: ["Don't let hips sag", "Breathe normally", "Engage entire core"],
    caloriesPerMinute: 5
  },
  {
    name: "Russian Twists",
    category: "strength",
    targetMuscles: ["core", "obliques"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    description: "Rotational core exercise targeting obliques",
    instructions: [
      "Sit with knees bent, lean back slightly",
      "Lift feet off ground",
      "Rotate torso left and right",
      "Keep chest up throughout movement"
    ],
    tips: ["Control the movement", "Keep core engaged", "Don't rush"],
    caloriesPerMinute: 7
  },
  
  // Cardio
  {
    name: "Jumping Jacks",
    category: "cardio",
    targetMuscles: ["full-body", "cardio-system"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "Full-body cardio exercise",
    instructions: [
      "Start standing with feet together, arms at sides",
      "Jump feet apart while raising arms overhead",
      "Jump back to starting position",
      "Repeat at steady pace"
    ],
    tips: ["Land softly", "Keep core engaged", "Maintain steady rhythm"],
    caloriesPerMinute: 12
  },
  {
    name: "Burpees",
    category: "cardio",
    targetMuscles: ["full-body", "cardio-system"],
    equipment: ["bodyweight"],
    difficulty: "advanced",
    description: "High-intensity full-body exercise",
    instructions: [
      "Start standing, squat down and place hands on floor",
      "Jump feet back to plank position",
      "Do a push-up (optional)",
      "Jump feet back to squat, then jump up with arms overhead"
    ],
    tips: ["Pace yourself", "Modify as needed", "Keep form over speed"],
    caloriesPerMinute: 15
  },
  
  // Flexibility
  {
    name: "Downward Dog",
    category: "flexibility",
    targetMuscles: ["hamstrings", "calves", "shoulders", "back"],
    equipment: ["yoga-mat"],
    difficulty: "beginner",
    description: "Yoga pose that stretches multiple muscle groups",
    instructions: [
      "Start on hands and knees",
      "Tuck toes under and lift hips up",
      "Straighten legs and create inverted V shape",
      "Hold position while breathing deeply"
    ],
    tips: ["Keep hands firmly planted", "Pedal feet to warm up", "Don't force straight legs"],
    caloriesPerMinute: 3
  }
];

async function seedExercises() {
  try {
    await connectDB();
    
    // Clear existing exercises (optional)
    console.log('Clearing existing exercises...');
    await Exercise.deleteMany({});
    
    // Insert sample exercises
    console.log('Inserting sample exercises...');
    const insertedExercises = await Exercise.insertMany(sampleExercises);
    
    console.log(`Successfully inserted ${insertedExercises.length} exercises`);
    
    // Display inserted exercise IDs for reference
    console.log('\nExercise IDs for reference:');
    insertedExercises.forEach(exercise => {
      console.log(`${exercise.name}: ${exercise._id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
}

// Run the seeder
seedExercises();