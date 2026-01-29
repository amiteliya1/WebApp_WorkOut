/**
 * Muscle subcategories mapping: English muscle → Array of subcategories
 *
 * Each subcategory has:
 * - label: English label for display
 * - query: English search query for YouTube API
 */
export const MUSCLE_SUBCATEGORIES = {
  "Chest": [
    { label: "General", query: "chest workout" },
    { label: "Upper Chest", query: "upper chest workout" },
    { label: "Regular Chest", query: "chest workout" }
  ],
  "Arms": [
    { label: "General", query: "arms workout" },
    { label: "Front Arm (Biceps)", query: "biceps workout" },
    { label: "Back Arm (Triceps)", query: "triceps workout" }
  ],
  "Legs": [
    { label: "General", query: "leg workout" },
    { label: "Squat", query: "squat tutorial workout" },
    { label: "Lunges", query: "lunges workout" }
  ],
  "Back": [
    { label: "General", query: "back workout" },
    { label: "Upper Back", query: "upper back workout" },
    { label: "Lower Back", query: "lower back workout" }
  ],
  "Shoulders": [
    { label: "General", query: "shoulder workout" },
    { label: "Front Shoulders", query: "front delts workout" },
    { label: "Side Shoulders", query: "lateral delts workout" },
    { label: "Rear Shoulders", query: "rear delts workout" }
  ],
  "Abs": [
    { label: "General", query: "abs workout" },
    { label: "Upper Abs", query: "upper abs workout" },
    { label: "Lower Abs", query: "lower abs workout" }
  ]
};

/**
 * Get subcategories for a muscle (English name)
 * @param {string} muscleName - English name of the muscle
 * @returns {Array} Array of subcategories, or empty array if not found
 */
export const getSubcategoriesForMuscle = (muscleName) => {
  return MUSCLE_SUBCATEGORIES[muscleName] || [];
};
