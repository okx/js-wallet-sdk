/**
 * The following methods are based on `polkadot-js`, thanks for their work
 * https://github.com/polkadot-js/common/tree/master/packages/util
 */
export function objectKeys<T extends object, K extends Extract<keyof T, string>> (value: T): K[] {
    return Object.keys(value) as K[];
}

export function objectSpread <T extends object> (dest: object, ...sources: (object | undefined | null)[]): T {
    for (let i = 0; i < sources.length; i++) {
        const src = sources[i];

        if (src) {
            const keys = objectKeys(src);

            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];

                dest[key] = src[key];
            }
        }
    }

    return dest as T;
}