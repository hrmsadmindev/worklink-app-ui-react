// Validation utility functions

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Password strength validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

// Calculate password strength
const calculatePasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 3) return 'weak';
  if (score < 5) return 'medium';
  return 'strong';
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Minimum length validation
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

// Maximum length validation
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = 'Field') => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} must be a valid number`;
  }
  return null;
};

// Positive number validation
export const validatePositiveNumber = (value, fieldName = 'Field') => {
  const numberError = validateNumber(value, fieldName);
  if (numberError) return numberError;

  if (value && Number(value) <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

// Date validation
export const validateDate = (value, fieldName = 'Date') => {
  if (value && isNaN(Date.parse(value))) {
    return `${fieldName} must be a valid date`;
  }
  return null;
};

// Future date validation
export const validateFutureDate = (value, fieldName = 'Date') => {
  const dateError = validateDate(value, fieldName);
  if (dateError) return dateError;

  if (value && new Date(value) <= new Date()) {
    return `${fieldName} must be in the future`;
  }
  return null;
};

// Past date validation
export const validatePastDate = (value, fieldName = 'Date') => {
  const dateError = validateDate(value, fieldName);
  if (dateError) return dateError;

  if (value && new Date(value) >= new Date()) {
    return `${fieldName} must be in the past`;
  }
  return null;
};

// Salary validation
export const validateSalary = (value) => {
  const numberError = validatePositiveNumber(value, 'Salary');
  if (numberError) return numberError;

  const salary = Number(value);
  if (salary > 0 && salary < 1000) {
    return 'Salary seems too low, please verify';
  }
  if (salary > 10000000) {
    return 'Salary seems too high, please verify';
  }
  return null;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];

    fieldRules.forEach(rule => {
      if (!errors[field]) { // Only set first error for each field
        let error = null;

        switch (rule.type) {
          case 'required':
            error = validateRequired(value, rule.message || field);
            break;
          case 'email':
            if (value && !isValidEmail(value)) {
              error = rule.message || 'Please enter a valid email address';
            }
            break;
          case 'phone':
            if (value && !isValidPhone(value)) {
              error = rule.message || 'Please enter a valid phone number';
            }
            break;
          case 'minLength':
            error = validateMinLength(value, rule.value, rule.message || field);
            break;
          case 'maxLength':
            error = validateMaxLength(value, rule.value, rule.message || field);
            break;
          case 'number':
            error = validateNumber(value, rule.message || field);
            break;
          case 'positiveNumber':
            error = validatePositiveNumber(value, rule.message || field);
            break;
          case 'date':
            error = validateDate(value, rule.message || field);
            break;
          case 'futureDate':
            error = validateFutureDate(value, rule.message || field);
            break;
          case 'pastDate':
            error = validatePastDate(value, rule.message || field);
            break;
          case 'custom':
            error = rule.validator(value, data);
            break;
          default:
            break;
        }

        if (error) {
          errors[field] = error;
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Employee form validation rules
export const employeeValidationRules = {
  firstName: [
    { type: 'required' },
    { type: 'minLength', value: 2 },
    { type: 'maxLength', value: 50 }
  ],
  lastName: [
    { type: 'required' },
    { type: 'minLength', value: 2 },
    { type: 'maxLength', value: 50 }
  ],
  email: [
    { type: 'required' },
    { type: 'email' }
  ],
  phoneNumber: [
    { type: 'phone' }
  ],
  hireDate: [
    { type: 'required' },
    { type: 'date' },
    { type: 'pastDate' }
  ],
  departmentId: [
    { type: 'required' }
  ],
  positionId: [
    { type: 'required' }
  ]
};

// Job posting validation rules
export const jobValidationRules = {
  title: [
    { type: 'required' },
    { type: 'minLength', value: 3 },
    { type: 'maxLength', value: 100 }
  ],
  description: [
    { type: 'required' },
    { type: 'minLength', value: 50 }
  ],
  departmentId: [
    { type: 'required' }
  ],
  closingDate: [
    { type: 'date' },
    { type: 'futureDate' }
  ]
};

// Performance goal validation rules
export const goalValidationRules = {
  objective: [
    { type: 'required' },
    { type: 'minLength', value: 10 },
    { type: 'maxLength', value: 255 }
  ],
  targetValue: [
    { type: 'maxLength', value: 100 }
  ],
  startDate: [
    { type: 'required' },
    { type: 'date' }
  ],
  endDate: [
    { type: 'required' },
    { type: 'date' },
    { 
      type: 'custom', 
      validator: (value, data) => {
        if (value && data.startDate && new Date(value) <= new Date(data.startDate)) {
          return 'End date must be after start date';
        }
        return null;
      }
    }
  ]
};

export default {
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validatePositiveNumber,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateSalary,
  validateForm,
  employeeValidationRules,
  jobValidationRules,
  goalValidationRules
};