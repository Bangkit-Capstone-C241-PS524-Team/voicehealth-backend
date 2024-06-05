/* eslint-disable  @typescript-eslint/no-explicit-any */
export function convertBigIntToString(obj) {
    // TODO: prevent large object
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToString);
    }

    if (obj instanceof Date) {
        return obj;
    }

    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const convertedValue = convertBigIntToString(value);

        if (typeof convertedValue === 'bigint') {
            acc[key] = convertedValue.toString();
        } else {
            acc[key] = convertedValue;
        }

        return acc;
    }, {});
}
