/**
 * Format JavaScript Date to MySQL datetime format (YYYY-MM-DD HH:mm:ss)
 * @param {Date|number|string} date - Date object, timestamp, or date string
 * @returns {string} - Formatted datetime string for MySQL
 */
export function formatDateForSQL(date) {
  let dateObj;

  if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date();
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get current datetime in MySQL format
 * @returns {string} - Current datetime string
 */
export function getCurrentDateTimeSQL() {
  return formatDateForSQL(new Date());
}
