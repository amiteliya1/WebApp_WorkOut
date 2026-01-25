/**
 * Muscle subcategories mapping: Hebrew muscle → Array of subcategories
 * 
 * Each subcategory has:
 * - labelHe: Hebrew label for display
 * - query: English search query for YouTube API
 */
export const MUSCLE_SUBCATEGORIES = {
  "חזה": [
    { labelHe: "כללי", query: "chest workout" },
    { labelHe: "חזה עליון", query: "upper chest workout" },
    { labelHe: "חזה רגיל", query: "chest workout" }
  ],
  "ידיים": [
    { labelHe: "כללי", query: "arms workout" },
    { labelHe: "יד קדמי (בייספס)", query: "biceps workout" },
    { labelHe: "יד אחורי (טרייספס)", query: "triceps workout" }
  ],
  "רגליים": [
    { labelHe: "כללי", query: "leg workout" },
    { labelHe: "סקוואט", query: "squat tutorial workout" },
    { labelHe: "לאנג׳ (Lunges)", query: "lunges workout" }
  ],
  "גב": [
    { labelHe: "כללי", query: "back workout" },
    { labelHe: "גב עליון", query: "upper back workout" },
    { labelHe: "גב תחתון", query: "lower back workout" }
  ],
  "כתפיים": [
    { labelHe: "כללי", query: "shoulder workout" },
    { labelHe: "כתף קדמית", query: "front delts workout" },
    { labelHe: "כתף צד", query: "lateral delts workout" },
    { labelHe: "כתף אחורית", query: "rear delts workout" }
  ],
  "בטן": [
    { labelHe: "כללי", query: "abs workout" },
    { labelHe: "בטן עליונה", query: "upper abs workout" },
    { labelHe: "בטן תחתונה", query: "lower abs workout" }
  ]
};

/**
 * Get subcategories for a muscle (Hebrew name)
 * @param {string} hebrewMuscleName - Hebrew name of the muscle
 * @returns {Array} Array of subcategories, or empty array if not found
 */
export const getSubcategoriesForMuscle = (hebrewMuscleName) => {
  return MUSCLE_SUBCATEGORIES[hebrewMuscleName] || [];
};

