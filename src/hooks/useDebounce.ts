import {useEffect, useState} from 'react';

/**
 * A de-bouncer as a ReactHook
 * @link https://usehooks-ts.com/react-hook/use-debounce
 * @param {any} value The value to be debounced
 * @param {number} delay The optional delay in ms to de-bounce, if not given the delay defaults to 500
 * @returns {any} The debounced value
 */
const useDebounce = <T>(value: T, delay?: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
