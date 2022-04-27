import {ClientRecord} from 'types/RecordTypes';

/**
 * Given a ResidentRecord return the first and last name of the client in the format: first last
 * If the client Nickname field is populated then the format is: first last "nickname"
 * @param {ClientRecord} resident The client record
 * @param {boolean} includeNickname True if nickname should be returned in quotes, no display of the nickname otherwise
 */
const clientFullName = (resident: ClientRecord, includeNickname = false): string => {
    const clientName = resident.FirstName.trim() + ' ' + resident.LastName.trim();
    return includeNickname && resident?.Nickname && resident?.Nickname.trim().length > 0
        ? clientName + ' "' + resident.Nickname.trim() + '"'
        : clientName;
};

export default clientFullName;
