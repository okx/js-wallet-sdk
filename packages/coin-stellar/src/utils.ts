export function convertWithDecimals(numStr: string, decimals: number) {
    if (numStr == "0") {
        return numStr
    }
    if (!isPositiveIntegerNoZero(numStr)) {
        throw new RangeError("Number should be a positive integer");
    }
    if (numStr.length <= decimals) {
        numStr = addLeadingZeros(numStr, decimals + 1);
    }
    let position = numStr.length - decimals
    return numStr.slice(0, position) + "." + numStr.slice(position);
}

function addLeadingZeros(str: string | number, length: number): string {
    return String(str).padStart(length, "0");
}

function isPositiveIntegerNoZero(str: string): boolean {
    return /^[1-9]\d*$/.test(str);
}