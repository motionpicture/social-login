/**
 * check null and return null or date
 */
function checkForDate(data: any): any {
    let result: any = '';
    if (typeof data === undefined) {
        result = undefined;
    } else {
        result = new Date(data);
    }

    return result;
}

/**
 * check null
 */
function checkNull(checker: any, data: any): any {
    let result: any = '';
    if (checker !== null) {
        result = data;
    } else {
        result = undefined;
    }

    return result;
}

export { checkForDate, checkNull };
