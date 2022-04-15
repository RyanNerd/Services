/**
 * Given a string or Date object return the formatted string of the date: mm/dd/yyyy, hh:mm AM
 * @param {Date | string} date The date to parse and format
 * @param {boolean} dateOnly Set to true to just return the formatted date without the time
 * @returns {string} The date in the format of MM/DD/YYYY HH:MM am/pm
 */
const getFormattedDate = (date: Date | string, dateOnly?: boolean): string => {
    const dt = typeof date === 'string' ? new Date(date) : date;
    return dateOnly
        ? dt.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour12: true
          } as Intl.DateTimeFormatOptions)
        : dt.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
          } as Intl.DateTimeFormatOptions);
};

export default getFormattedDate;
