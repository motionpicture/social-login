/**
 * check null and return null or date
 */
function checkForDate(data: any): any {
    let result: any = '';
    try {
        if (data !== null && data !== undefined) {
            const timestamp = Date.parse(data);
            if (isNaN(timestamp) === false) {
                result = new Date(timestamp);
            } else {
                result = undefined;
            }
        } else {
            result = undefined;
        }
    } catch (err) {
        result = undefined;
    }

    return result;
}

/**
 * check null
 */
function checkNull(data: any): any {
    let result: any = '';
    try {
        if (data !== null && data !== undefined) {
            result = data;
        } else {
            result = undefined;
        }
    } catch (err) {
        result = undefined;
    }

    return result;
}

export { checkForDate, checkNull };
