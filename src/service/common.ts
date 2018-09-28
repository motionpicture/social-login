/**
 * check null and return null or date
 */
function checkForDate(checker: any, data: any): any {
    if (checker !== null) {
        if (data !== null) {
            return new Date(data);
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * check null
 */
function checkNull(checker: any, data: any): any {
    return (checker !== undefined) ? data : undefined;
}

export { checkForDate, checkNull };
