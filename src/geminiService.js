// geminiService.js - Enhanced Gemini API Integration with Strict Dietary Enforcement

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Main function to generate fitness and diet plans
 */
export const generateFitnessPlan = async (formData) => {
  try {
    const prompt = createPrompt(formData);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse and validate
    const plan = parseGeminiResponse(generatedText, formData);

    return plan;
  } catch (error) {
    console.error('Error generating fitness plan:', error);
    return createFallbackPlan(formData);
  }
};

/**
 * Create dynamic prompt for Gemini
 */
const createPrompt = (formData) => {
  const dietaryGuidelines = {
    veg: {
      description: 'STRICTLY VEGETARIAN',
      forbidden:
        'ABSOLUTELY NO meat, chicken, beef, pork, lamb, fish, seafood, or any animal flesh',
      allowed:
        'ONLY: Vegetables, fruits, grains, legumes, beans, lentils, dairy (milk, yogurt, cheese, paneer), eggs, nuts, seeds, tofu, tempeh',
      examples:
        'Paneer curry, Dal, Vegetable stir-fry, Egg dishes, Greek yogurt, Chickpeas, Tofu scramble, Lentil soup',
    },
    'non-veg': {
      description: 'Non-vegetarian',
      forbidden: 'None',
      allowed:
        'All food types including meat, poultry, fish, seafood, eggs, dairy, and plant-based foods',
      examples: 'Chicken breast, Salmon, Eggs, Beef, Turkey, Shrimp',
    },
    vegan: {
      description: 'STRICTLY VEGAN',
      forbidden:
        'ABSOLUTELY NO animal products: meat, chicken, fish, seafood, dairy, eggs, honey, or any animal-derived ingredients',
      allowed:
        'ONLY: Plant-based foods - vegetables, fruits, grains, legumes, beans, lentils, nuts, seeds, tofu, tempeh, plant milk, nutritional yeast',
      examples:
        'Tofu scramble, Chickpea curry, Lentil soup, Quinoa bowl, Almond milk smoothie, Bean burrito, Vegetable stir-fry with tempeh',
    },
    keto: {
      description: 'KETOGENIC - Very Low Carb',
      forbidden:
        'NO grains, bread, rice, pasta, potatoes, sugar, most fruits, high-carb vegetables',
      allowed:
        'Meat, fish, eggs, cheese, butter, oils, nuts, seeds, low-carb vegetables, avocado',
      examples:
        'Grilled chicken with broccoli, Salmon with asparagus, Egg omelette with cheese, Steak with cauliflower',
    },
  };

  const dietInfo = dietaryGuidelines[formData.diet] || dietaryGuidelines['non-veg'];

  return `
You are a certified personal trainer and nutritionist. Create a personalized 7-day workout and diet plan for this user. 
⚠️ IMPORTANT: The plan MUST strictly follow their diet type. Do NOT include forbidden foods.

User Details:
- Name: ${formData.name}
- Age: ${formData.age}
- Gender: ${formData.gender}
- Height: ${formData.height} cm
- Weight: ${formData.weight} kg
- Goal: ${formData.goal}
- Fitness Level: ${formData.level}
- Workout Location: ${formData.location}
- Diet Type: ${dietInfo.description}
- Medical Info: ${formData.medical || 'None'}

🚫 Forbidden Foods: ${dietInfo.forbidden}
✅ Allowed Foods: ${dietInfo.allowed}

Response must be **ONLY JSON**, no markdown, no explanations:
{
  "workout": {
    "title": "Personalized ${formData.goal} Plan",
    "schedule": [
      { "day": "Monday", "focus": "Upper Body", "exercises": [] },
      { "day": "Tuesday", "focus": "Lower Body", "exercises": [] },
      { "day": "Wednesday", "focus": "Cardio", "exercises": [] },
      { "day": "Thursday", "focus": "Core", "exercises": [] },
      { "day": "Friday", "focus": "Full Body", "exercises": [] },
      { "day": "Saturday", "focus": "Active Recovery", "exercises": [] },
      { "day": "Sunday", "focus": "Rest", "exercises": [] }
    ],
    "tips": ["Proper form", "Hydration", "Rest", "Consistency"]
  },
  "diet": {
    "title": "${formData.diet.toUpperCase()} Meal Plan",
    "meals": {
      "breakfast": [],
      "lunch": [],
      "snack": [],
      "dinner": []
    },
    "hydration": "Drink 3-4 liters water/day",
    "supplements": []
  }
}
`;
};

/**
 * Parse Gemini response text safely and validate against diet restrictions
 */
const parseGeminiResponse = (responseText, formData) => {
  try {
    let cleaned = responseText.trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const validated = validateDietaryRestrictions(parsed, formData.diet);
    return { user: formData, ...validated };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.log('Raw Response:', responseText);
    return createFallbackPlan(formData);
  }
};

/**
 * Validate vegetarian / vegan constraints and auto-replace invalid items
 */
const validateDietaryRestrictions = (plan, dietType) => {
  const forbiddenWords = [
    'chicken', 'fish', 'beef', 'pork', 'lamb', 'mutton', 'turkey', 'seafood',
    'shrimp', 'crab', 'bacon', 'ham', 'sausage', 'steak', 'meat', 'egg', 'honey'
  ];

  if (dietType === 'veg' || dietType === 'vegan') {
    Object.keys(plan.diet.meals).forEach((mealType) => {
      plan.diet.meals[mealType] = plan.diet.meals[mealType].filter((item) => {
        const lower = item.name.toLowerCase();
        const isForbidden = forbiddenWords.some((w) => lower.includes(w));
        if (isForbidden) {
          console.warn(`⚠️ Removed forbidden item: ${item.name}`);
          return false;
        }
        return true;
      });

      // If all removed → add safe replacements
      if (plan.diet.meals[mealType].length === 0) {
        plan.diet.meals[mealType] = getReplacementMeals(mealType, dietType);
      }
    });
  }

  return plan;
};

/**
 * Default replacement meals if API gives invalid ones
 */
const getReplacementMeals = (mealType, dietType) => {
  const vegMeals = {
    breakfast: [
      { name: 'Oatmeal with Fruits & Nuts', calories: 320, protein: '12g', carbs: '50g', fats: '8g' },
      { name: 'Paneer Sandwich', calories: 280, protein: '18g', carbs: '30g', fats: '10g' },
    ],
    lunch: [
      { name: 'Dal Tadka with Brown Rice', calories: 420, protein: '20g', carbs: '60g', fats: '8g' },
      { name: 'Vegetable Curry with Roti', calories: 350, protein: '10g', carbs: '45g', fats: '7g' },
    ],
    snack: [
      { name: 'Mixed Nuts', calories: 200, protein: '6g', carbs: '12g', fats: '14g' },
      { name: 'Greek Yogurt with Honey', calories: 150, protein: '8g', carbs: '18g', fats: '3g' },
    ],
    dinner: [
      { name: 'Tofu Stir Fry', calories: 400, protein: '22g', carbs: '35g', fats: '12g' },
      { name: 'Lentil Soup with Quinoa', calories: 380, protein: '20g', carbs: '55g', fats: '8g' },
    ],
  };

  const veganMeals = {
    breakfast: [
      { name: 'Smoothie with Almond Milk', calories: 280, protein: '10g', carbs: '40g', fats: '8g' },
      { name: 'Tofu Scramble with Veggies', calories: 300, protein: '20g', carbs: '20g', fats: '10g' },
    ],
    lunch: [
      { name: 'Chickpea Bowl', calories: 420, protein: '18g', carbs: '60g', fats: '10g' },
      { name: 'Veggie Burrito', calories: 400, protein: '16g', carbs: '55g', fats: '9g' },
    ],
    snack: [
      { name: 'Trail Mix', calories: 200, protein: '8g', carbs: '20g', fats: '10g' },
      { name: 'Hummus with Carrot Sticks', calories: 180, protein: '6g', carbs: '15g', fats: '8g' },
    ],
    dinner: [
      { name: 'Lentil Dal with Brown Rice', calories: 420, protein: '20g', carbs: '60g', fats: '8g' },
      { name: 'Quinoa with Roasted Veggies', calories: 390, protein: '18g', carbs: '55g', fats: '9g' },
    ],
  };

  return dietType === 'vegan' ? veganMeals[mealType] || [] : vegMeals[mealType] || [];
};

/**
 * Fallback plan when Gemini fails
 */
const createFallbackPlan = (formData) => ({
  user: formData,
  workout: {
    title: `${formData.goal} Plan (Fallback)`,
    schedule: [
      { day: 'Monday', focus: 'Upper Body', exercises: [{ name: 'Pushups', sets: 3, reps: '12' }] },
      { day: 'Tuesday', focus: 'Lower Body', exercises: [{ name: 'Squats', sets: 3, reps: '15' }] },
      { day: 'Wednesday', focus: 'Cardio', exercises: [{ name: 'Jump Rope', sets: 3, reps: '2 min' }] },
    ],
    tips: ['Stay consistent', 'Eat balanced meals', 'Get enough rest'],
  },
  diet: {
    title: `${formData.diet.toUpperCase()} Meal Plan`,
    meals: getReplacementMeals('breakfast', formData.diet),
    hydration: 'Drink 3-4 liters daily',
    supplements: ['Multivitamin'],
  },
});

