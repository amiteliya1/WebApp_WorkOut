/**
 * Muscle mapping: English → English search terms for video API
 *
 * This mapping is used to convert muscle names to search terms
 * when fetching workout videos from YouTube.
 *
 * To add a new muscle group:
 * 1. Add the English name as key
 * 2. Add the English search term as value (include "workout" for better results)
 */
export const MUSCLE_MAPPING = {
  "Back": "back workout",
  "Chest": "chest workout",
  "Shoulders": "shoulder workout",
  "Legs": "leg workout",
  "Arms": "arms workout",
  "Abs": "abs workout"
};

/**
 * Reverse mapping: Search term → Display name (for display purposes)
 */
export const MUSCLE_REVERSE_MAPPING = {
  "back workout": "Back",
  "chest workout": "Chest",
  "shoulder workout": "Shoulders",
  "leg workout": "Legs",
  "arms workout": "Arms",
  "abs workout": "Abs"
};

/**
 * Get English search term from muscle name
 * @param {string} muscleName - English name of the muscle
 * @returns {string} English search term, or the original string if not found
 */
export const getEnglishSearchTerm = (muscleName) => {
  return MUSCLE_MAPPING[muscleName] || muscleName;
};

/**
 * Get muscle name from English search term
 * @param {string} searchTerm - English search term
 * @returns {string} Muscle name, or the original string if not found
 */
export const getMuscleName = (searchTerm) => {
  return MUSCLE_REVERSE_MAPPING[searchTerm] || searchTerm;
};
