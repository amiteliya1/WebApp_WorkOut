/**
 * Muscle mapping: Hebrew → English search terms for video API
 * 
 * This mapping is used to convert Hebrew muscle names to English search terms
 * when fetching workout videos from YouTube.
 * 
 * To add a new muscle group:
 * 1. Add the Hebrew name as key
 * 2. Add the English search term as value (include "workout" for better results)
 */
export const MUSCLE_MAPPING = {
  "גב": "back workout",
  "חזה": "chest workout",
  "כתפיים": "shoulder workout",
  "רגליים": "leg workout",
  "ידיים": "arms workout",
  "בטן": "abs workout"
};

/**
 * Reverse mapping: English → Hebrew (for display purposes)
 */
export const MUSCLE_REVERSE_MAPPING = {
  "back workout": "גב",
  "chest workout": "חזה",
  "shoulder workout": "כתפיים",
  "leg workout": "רגליים",
  "arms workout": "ידיים",
  "abs workout": "בטן"
};

/**
 * Get English search term from Hebrew muscle name
 * @param {string} hebrewName - Hebrew name of the muscle
 * @returns {string} English search term, or the original string if not found
 */
export const getEnglishSearchTerm = (hebrewName) => {
  return MUSCLE_MAPPING[hebrewName] || hebrewName;
};

/**
 * Get Hebrew name from English search term
 * @param {string} englishTerm - English search term
 * @returns {string} Hebrew name, or the original string if not found
 */
export const getHebrewName = (englishTerm) => {
  return MUSCLE_REVERSE_MAPPING[englishTerm] || englishTerm;
};

