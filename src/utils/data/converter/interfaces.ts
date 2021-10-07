export default interface ValueConverter {

    fromString: (value: string, type: Function) => any;

    toString: (value: any, type: Function) => string;
}