type ErrorType = undefined | string | Error;

const check = (statement: any, orError?: ErrorType) => {
    if (!statement) {
        orError = orError ? orError : 'Invalid statement';
        orError = orError instanceof Error ? orError : new Error(orError);

        throw orError;
    }
};

const checkIsDefined = <T>(something?: T, orError?: ErrorType): T => {
    check(
        typeof something !== 'undefined',
        orError || 'Expect defined but actually undefined',
    );
    return something as T;
};

const checkIsUndefined = (something: any, orError?: ErrorType) => {
    check(
        typeof something === 'undefined',
        orError || `Expect undefined but actually ${something}`,
    );
};

export {check, checkIsDefined, checkIsUndefined};
