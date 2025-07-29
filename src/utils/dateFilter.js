/**
 * Utility functions for filtering data by date ranges
 */

/**
 * Parse date from various formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
 * @param {string} dateString - Date string in various formats
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Handle DD/MM/YYYY format (common in Brazilian data)
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
    }
    
    // Handle YYYY-MM-DD format
    if (dateString.includes('-')) {
      return new Date(dateString);
    }
    
    // Handle ISO string format
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
    
    // Try direct Date constructor
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

/**
 * Check if a date falls within a given range
 * @param {Date} date - Date to check
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @returns {boolean} - True if date is within range
 */
export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  
  const dateTime = date.getTime();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  
  return dateTime >= startTime && dateTime <= endTime;
};

/**
 * Filter data by date range
 * @param {Array} data - Array of data objects
 * @param {string} dateField - Field name containing the date
 * @param {Date} startDate - Start date of range
 * @param {Date} endDate - End date of range
 * @returns {Array} - Filtered data array
 */
export const filterDataByDateRange = (data, dateField, startDate, endDate) => {
  if (!Array.isArray(data) || !dateField || !startDate || !endDate) {
    return data;
  }
  
  return data.filter(item => {
    const itemDate = parseDate(item[dateField]);
    return itemDate && isDateInRange(itemDate, startDate, endDate);
  });
};

/**
 * Filter data by month (current month or X months ago)
 * @param {Array} data - Array of data objects
 * @param {string} dateField - Field name containing the date
 * @param {number} monthsAgo - Number of months ago (0 = current month)
 * @returns {Array} - Filtered data array
 */
export const filterDataByMonth = (data, dateField, monthsAgo = 0) => {
  if (!Array.isArray(data) || !dateField) {
    return data;
  }
  
  const currentDate = new Date();
  const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsAgo, 1);
  const startDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const endDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
  
  return filterDataByDateRange(data, dateField, startDate, endDate);
};

/**
 * Get month name and year for display
 * @param {Date} date - Date to format
 * @returns {string} - Formatted month name
 */
export const getMonthDisplayName = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
};

/**
 * Get short month name for display
 * @param {Date} date - Date to format
 * @returns {string} - Short month name
 */
export const getShortMonthName = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Generate month options for selector
 * @param {number} monthsBack - Number of months to go back
 * @returns {Array} - Array of month options
 */
export const generateMonthOptions = (monthsBack = 12) => {
  const options = [];
  const currentDate = new Date();
  
  // Current month
  options.push({
    value: 'current',
    label: 'Current Month',
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  });

  // Previous months
  for (let i = 1; i <= monthsBack; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = getMonthDisplayName(date);
    
    options.push({
      value: `${i}month`,
      label: `${monthName} (${i} month${i > 1 ? 's' : ''} ago)`,
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    });
  }

  return options;
};

/**
 * Format date for display in charts and tables
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForDisplay = (date) => {
  const parsedDate = typeof date === 'string' ? parseDate(date) : date;
  if (!parsedDate) return 'Invalid Date';
  
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Get date range display text
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} - Formatted date range text
 */
export const getDateRangeDisplay = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  });
  const end = endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  });
  
  return `${start} - ${end}`;
}; 