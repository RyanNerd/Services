import {ClientRecord} from 'types/RecordTypes';
import padZero from 'utilities/padZero';

/**
 * Given a ResidentRecord return the first and last name of the client in the format: first last
 * If the client Nickname field is populated then the format is: first last "nickname"
 * @param {ClientRecord} resident The client record
 * @param {boolean} includeNickname True if nickname should be returned in quotes, no display of the nickname otherwise
 */
export const clientFullName = (resident: ClientRecord, includeNickname = false): string => {
    const clientName = resident.FirstName.trim() + ' ' + resident.LastName.trim();
    return includeNickname && resident?.Nickname && resident?.Nickname.trim().length > 0
        ? clientName + ' "' + resident.Nickname.trim() + '"'
        : clientName;
};

/**
 * Given the month day and year return the date as a string in the format mm/dd/yyyy
 * @param {string} month The month as a string
 * @param {string} day The day in the month as a string
 * @param {string} year The year as a string
 * @param {boolean} leadingZeros True if leading zeros in the output, otherwise no leading zeros
 * @returns {string} Date in the format of MM/DD/YYYY or M/D/YYYY depending on if leadingZeros is true.
 */
export const dateToString = (month: string, day: string, year: string, leadingZeros?: boolean): string => {
    return leadingZeros ? padZero(month) + '/' + padZero(day) + '/' + year : month + '/' + day + '/' + year;
};

/**
 * Given a ResidentRecord return the resident's DOB as a string.
 * @param {ClientRecord} resident The client record
 * @returns {string} Returns the DOB in the format MM/DD/YYYY
 */
export const clientDOB = (resident: ClientRecord): string => {
    return dateToString(resident.DOB_MONTH.toString(), resident.DOB_DAY.toString(), resident.DOB_YEAR.toString(), true);
};
