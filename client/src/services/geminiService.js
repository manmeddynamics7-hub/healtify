// Gemini AI Service for Food Analysis and Recipe Generation
// Now uses backend API for security and better architecture
import api from './api';

// Convert file to base64 for backend upload
// const fileToBase64 = async (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64Data = reader.result.split(',')[1];
//       resolve({
//         data: base64Data,
//         mimeType: file.type,
//         name: file.name
//       });
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };

// Analyze food image with health conditions consideration
export const analyzeFoodImage = async (imageFile, userHealthConditions = []) => {
  try {
    console.log('🤖 Starting food image analysis via backend API');
    
    // Validate input parameters
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error('Valid image file is required');
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB');
    }
    
    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('healthConditions', JSON.stringify(Array.isArray(userHealthConditions) ? userHealthConditions : []));
    
    // Send to backend API with multipart form data
    const response = await api.post('/ai/analyze-food-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000 // 60 seconds for image analysis
    });

    // Handle different response structures
    console.log(response.data);
    return response.data?.data || response.data;

  } catch (error) {
    console.error('Error analyzing food image:', error);
    
    // Fallback response
    return {
      foodName: "Food Item",
      calories: "Unable to analyze",
      nutritionFacts: {
        protein: "0g",
        carbs: "0g",
        fat: "0g",
        fiber: "0g",
        sugar: "0g",
        sodium: "0mg"
      },
      servingSize: "1 serving",
      healthScore: 5,
      isHealthy: true,
      recommendation: "Unable to analyze image. Please try uploading a clearer photo.",
      healthWarnings: ["Image analysis failed"],
      healthBenefits: [],
      suitableFor: [],
      avoidIf: [],
      alternatives: [],
      preparation: "Unknown",
      ingredients: []
    };
  }
};

// Generate recipe based on ingredients and health conditions
export const generateHealthyRecipe = async (ingredients, userHealthConditions = [], dietaryPreferences = {}) => {
  try {
    console.log('🤖 Generating healthy recipe via backend API');
    
    // Validate input parameters
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('Ingredients array is required and must not be empty');
    }
    
    const validIngredients = ingredients.filter(ing => ing && typeof ing === 'string' && ing.trim());
    if (validIngredients.length === 0) {
      throw new Error('At least one valid ingredient is required');
    }
    
    const response = await api.post('/ai/generate-recipe', {
      ingredients: validIngredients.map(ing => ing.trim()),
      healthConditions: Array.isArray(userHealthConditions) ? userHealthConditions : [],
      dietaryPreferences: dietaryPreferences || {}
    });

    // Handle different response structures
    return response.data?.data || response.data;

  } catch (error) {
    console.error('Error generating recipe:', error);
    
    // Fallback response
    return {
      recipeName: "Simple Healthy Recipe",
      cookingTime: "30 minutes",
      difficulty: "Easy",
      servings: "2-3",
      calories: "200-300 per serving",
      healthScore: 7,
      ingredients: ingredients.map(ing => ({
        item: ing,
        amount: "As needed",
        notes: "Fresh preferred"
      })),
      instructions: [
        "Prepare all ingredients",
        "Cook according to your preference",
        "Season with healthy spices",
        "Serve immediately"
      ],
      nutritionFacts: {
        protein: "15g",
        carbs: "20g",
        fat: "8g",
        fiber: "5g",
        sugar: "3g",
        sodium: "200mg"
      },
      healthBenefits: ["Provides essential nutrients"],
      suitableFor: ["General health"],
      modifications: {
        diabetes: "Reduce carbs, add more fiber",
        hypertension: "Reduce sodium, add potassium-rich foods",
        pcos: "Add anti-inflammatory spices"
      },
      tips: ["Recipe generation failed, showing basic template"]
    };
  }
};

// Generate multiple recipes from ingredients
export const generateRecipeFromIngredients = async (ingredients, healthConditions = [], dietType = 'vegetarian') => {
  try {
    console.log('🤖 Generating multiple recipes via backend API');
    
    const response = await api.post('/ai/generate-multiple-recipes', {
      ingredients,
      healthConditions,
      dietType
    });

    return response.data.data;

  } catch (error) {
    console.error('Error generating recipes:', error);
    
    // Fallback response
    return [
      {
        recipeName: "Simple Healthy Recipe",
        cookingTime: "30 minutes",
        difficulty: "Easy",
        servings: "2-3",
        calories: "200-300 per serving",
        healthScore: 7,
        ingredients: [
          {
            item: ingredients,
            amount: "As needed",
            notes: "Fresh preferred"
          }
        ],
        instructions: [
          "Prepare all ingredients",
          "Cook according to your preference",
          "Season with healthy spices",
          "Serve immediately"
        ],
        nutritionFacts: {
          protein: "15g",
          carbs: "20g",
          fat: "8g",
          fiber: "5g",
          sugar: "3g",
          sodium: "200mg"
        },
        healthBenefits: ["Provides essential nutrients"],
        suitableFor: ["General health"],
        modifications: {
          diabetes: "Reduce carbs, add more fiber",
          hypertension: "Reduce sodium, add potassium-rich foods",
          pcos: "Add anti-inflammatory spices"
        },
        tips: ["Recipe generation failed, showing basic template"]
      }
    ];
  }
};

// Analyze food by name (text-based analysis)
export const analyzeFoodByName = async (foodName, userHealthConditions = []) => {
  try {
    console.log('🤖 Starting food analysis by name via backend API');
    console.log('🍎 Food name:', foodName);
    console.log('🏥 Health conditions:', userHealthConditions);
    
    // Validate input parameters
    if (!foodName || typeof foodName !== 'string' || !foodName.trim()) {
      throw new Error('Food name is required and must be a non-empty string');
    }
    
    const response = await api.post('/ai/analyze-food-name', {
      foodName: foodName.trim(),
      healthConditions: Array.isArray(userHealthConditions) ? userHealthConditions : []
    });

    // Handle different response structures
    return response.data?.data || response.data;

  } catch (error) {
    console.error('Error analyzing food by name:', error);
    
    // Fallback response
    return {
      foodName: foodName,
      calories: "Unable to analyze",
      nutritionFacts: {
        protein: "0g",
        carbs: "0g",
        fat: "0g",
        fiber: "0g",
        sugar: "0g",
        sodium: "0mg"
      },
      servingSize: "1 serving",
      healthScore: 5,
      isHealthy: true,
      recommendation: "Unable to analyze food. Please try again.",
      healthWarnings: ["Analysis failed"],
      healthBenefits: [],
      suitableFor: [],
      avoidIf: [],
      alternatives: [],
      bestTimeToEat: "Anytime"
    };
  }
};

// Get meal recommendations based on health conditions
export const getMealRecommendations = async (mealType, userHealthConditions = [], dietaryPreferences = {}) => {
  try {
    console.log('🤖 Getting meal recommendations via backend API');
    
    const response = await api.post('/ai/meal-recommendations', {
      mealType,
      healthConditions: userHealthConditions,
      dietaryPreferences
    });

    return response.data.data;

  } catch (error) {
    console.error('Error getting meal recommendations:', error);
    
    // Fallback response
    return {
      mealType,
      recommendations: [
        {
          name: "Healthy Option",
          description: "A nutritious meal option",
          calories: "300-400",
          healthScore: 7,
          suitableFor: ["General health"]
        }
      ],
      tips: ["Meal recommendation service temporarily unavailable"]
    };
  }
};

// Get nutrition advice based on health conditions
export const getNutritionAdvice = async (userHealthConditions = [], currentDiet = {}) => {
  try {
    console.log('🤖 Getting nutrition advice via backend API');
    
    const response = await api.post('/ai/nutrition-advice', {
      healthConditions: userHealthConditions,
      currentDiet
    });

    return response.data.data;

  } catch (error) {
    console.error('Error getting nutrition advice:', error);
    
    // Fallback response
    return {
      advice: "Focus on a balanced diet with plenty of fruits and vegetables.",
      recommendations: [
        "Eat regular meals",
        "Stay hydrated",
        "Include variety in your diet"
      ],
      warnings: [],
      suitableFor: userHealthConditions
    };
  }
};

// Generate chatbot response for health and nutrition questions
export const generateChatbotResponse = async (message, userContext = {}) => {
  try {
    console.log('🤖 Generating chatbot response via backend API');
    
    const response = await api.post('/ai/chat', {
      message,
      context: userContext
    });

    return response.data.data.response;

  } catch (error) {
    console.error('Error generating chatbot response:', error);
    
    // Fallback response
    return {
      response: "I'm here to help with your health and nutrition questions! However, I'm having trouble processing your request right now. Please try asking about food nutrition, healthy recipes, or meal planning.",
      suggestions: [
        "Ask about nutrition facts for specific foods",
        "Request healthy recipe suggestions",
        "Get meal planning advice",
        "Learn about foods for specific health conditions"
      ]
    };
  }
};

// Generate health recommendations based on user profile
export const generateHealthRecommendations = async (userProfile = {}) => {
  try {
    console.log('🤖 Generating health recommendations via backend API');
    
    const response = await api.post('/ai/health-recommendations', {
      userProfile: userProfile.userProfile || userProfile,
      healthConditions: userProfile.healthConditions || []
    });

    return response.data.data;

  } catch (error) {
    console.error('Error generating health recommendations:', error);
    
    // Fallback response
    return {
      recommendations: [
        {
          category: "Nutrition",
          title: "Balanced Diet",
          description: "Focus on a balanced diet with plenty of fruits and vegetables",
          priority: "high"
        },
        {
          category: "Exercise",
          title: "Regular Activity",
          description: "Aim for at least 30 minutes of moderate exercise daily",
          priority: "medium"
        },
        {
          category: "Hydration",
          title: "Stay Hydrated",
          description: "Drink at least 8 glasses of water daily",
          priority: "medium"
        }
      ],
      tips: [
        "Eat regular meals throughout the day",
        "Include variety in your diet",
        "Monitor portion sizes"
      ]
    };
  }
};

const geminiService = {
  analyzeFoodImage,
  generateHealthyRecipe,
  generateRecipeFromIngredients,
  analyzeFoodByName,
  getMealRecommendations,
  getNutritionAdvice,
  generateChatbotResponse,
  generateHealthRecommendations
};

export default geminiService;