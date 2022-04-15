/**
 * Given a numeric string pad zeros to the string
 * @param {string} number_ The number to zero pad
 * @returns {string} The zero padded number
 */
const padZero = (number_: string): string => {
    return ('00' + Number.parseInt(number_)).slice(-2);
};

export default padZero;
