/**
 * Return a random string.
 * @returns {string} The random string
 */
export const randomString = (): string => {
    // prettier-ignore
    return Math
            .random()
            .toString(36)
            .slice(2, 15)
        +
        Math
            .random()
            .toString(36)
            .slice(2, 15);
};
