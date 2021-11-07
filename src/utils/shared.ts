export const EMPTY_OBJECT = {};

export const EMPTY_STRING = '';

export const EMPTY_ARRAY = [];

export function isPrimitive(o: object): boolean {

    const type = typeof o;

    return type !== 'undefined' &&
        type !== 'object' &&
        type !== 'function';
}