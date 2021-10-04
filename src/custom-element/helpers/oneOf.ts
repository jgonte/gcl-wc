import getGlobalFunction from "./getGlobalFunction"

export class OneOf {

    constructor(
        public types: Function[]
    ) { }

    toProperty(value: any) {

        if (value === null &&
            this.types.includes(String)) { // When an attribute gets removed attributeChangedCallback gives the value of null

            return '';
        }

        // First try a function since that can create any of the objects below
        if (value !== null &&
            value[value.length - 2] === '(' && value[value.length - 1] === ')' // The function by convention must end in ()
            && this.types.includes(Function)) {

            var fcn = getGlobalFunction(value);

            if (fcn !== undefined) {

                return fcn;
            }
        }

        // if (this.types.includes(ElementNode)) {

        //     return createVirtualNode(value);
        // }

        if (this.types.includes(Object) ||
            this.types.includes(Array)
        ) {

            let o;

            try {

                o = JSON.parse(value);
            }
            catch (error) {

                if (!this.types.includes(String)) {

                    throw error; // Malformed JSON
                }

                // Try the other types below
            }

            if (o !== undefined) {

                if (!Array.isArray(o) &&
                    !this.types.includes(Object)) {

                    throw Error(`value: ${value} is not an array but there is no object type expected`);
                }

                if (Array.isArray(o) &&
                    !this.types.includes(Array)) {

                    throw Error(`value: ${value} is an array but there is no array type expected`);
                }

                return o;
            }
        }

        if (this.types.includes(Boolean)) {

            return value !== null && value !== 'false';
        }

        if (this.types.includes(Number)) {

            return value === null ? null : Number(value);
        }

        return value;
    }
}

export default function oneOf(...types) {

    return new OneOf(types);
}