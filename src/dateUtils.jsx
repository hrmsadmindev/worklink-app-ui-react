import { format, parseISO, isValid, differenceInDays, differenceInYears } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format datetime for display
export const formatDateTime = (date, formatString = 'MMM dd, yyyy HH:mm') => {
  return formatDate(date, formatString);
};

// Format date for form inputs (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

// Format time for display
export const formatTime = (time) => {
  if (!time) return 'N/A';

  try {
    // If time is in HH:mm:ss format, extract HH:mm
    if (typeof time === 'string' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    }

    const timeObj = typeof time === 'string' ? parseISO(time) : time;
    if (!isValid(timeObj)) return 'Invalid Time';
    return format(timeObj, 'HH:mm');
  } catch (error) {
    return 'Invalid Time';
  }
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;

  try {
    const dateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    if (!isValid(dateObj)) return null;
    return differenceInYears(new Date(), dateObj);
  } catch (error) {
    return null;
  }
};

// Calculate years of service
export const calculateYearsOfService = (joinDate) => {
  if (!joinDate) return null;

  try {
    const dateObj = typeof joinDate === 'string' ? parseISO(joinDate) : joinDate;
    if (!isValid(dateObj)) return null;
    return differenceInYears(new Date(), dateObj);
  } catch (error) {
    return null;
  }
};

// Calculate days between dates
export const daysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    if (!isValid(start) || !isValid(end)) return null;
    return differenceInDays(end, start);
  } catch (error) {
    return null;
  }
};

// Check if date is in the past
export const isDateInPast = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return differenceInDays(new Date(), dateObj) > 0;
  } catch (error) {
    return false;
  }
};

// Check if date is in the future
export const isDateInFuture = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return differenceInDays(dateObj, new Date()) > 0;
  } catch (error) {
    return false;
  }
};

// Get relative time (e.g., "2 days ago", "in 3 days")
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';

    const days = differenceInDays(new Date(), dateObj);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days === -1) return 'Tomorrow';
    if (days > 0) return `${days} days ago`;
    if (days < 0) return `in ${Math.abs(days)} days`;

    return formatDate(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Get current date in ISO format
export const getCurrentDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Get current datetime in ISO format
export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

// Validate date string
export const isValidDate = (dateString) => {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
};

// Format duration in hours and minutes
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0 mins';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hrs`;
  return `${hours} hrs ${mins} mins`;
};

// Calculate working hours between two times
export const calculateWorkingHours = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) return 0;

  try {
    // Parse time strings (HH:mm format)
    const [inHours, inMinutes] = clockIn.split(':').map(Number);
    const [outHours, outMinutes] = clockOut.split(':').map(Number);

    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    let diffMinutes = outTotalMinutes - inTotalMinutes;

    // Handle next day scenario
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Add 24 hours in minutes
    }

    return Math.round(diffMinutes / 60 * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    return 0;
  }
};