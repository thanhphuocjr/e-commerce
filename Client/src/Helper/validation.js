// Validation helper functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Object containing requirements and isValid flag
 */
export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isValid = Object.values(requirements).every((req) => req);
  return { requirements, isValid };
};

/**
 * Validate full name (letters with accents, spaces, and common punctuation)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateFullName = (name) => {
  // eslint-disable-next-line no-useless-escape
  const nameRegex = /^[\p{L}\s\-'\.]+$/u;
  return nameRegex.test(name);
};

/**
 * Validate phone number (basic international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if two values match
 * @param {string} value1 - First value
 * @param {string} value2 - Second value
 * @returns {boolean} - True if match, false otherwise
 */
export const validateMatch = (value1, value2) => {
  return value1 === value2;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateMinLength = (value, minLength) => {
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateMaxLength = (value, maxLength) => {
  return value.length <= maxLength;
};

/**
 * Check if value is empty
 * @param {string} value - Value to check
 * @returns {boolean} - True if empty, false otherwise
 */
export const isEmpty = (value) => {
  return !value || value.trim() === '';
};
