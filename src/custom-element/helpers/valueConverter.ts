import getGlobalFunction from "./getGlobalFunction";

const valueConverter = {

    toProperty: (value: string, type: Function | Function[]) => {

        if (!Array.isArray(type)) { // Convert type to array so we can handle multiple types as well

            type = [type];
        }

        if (value === null &&
            type.includes(String)) { // When an attribute gets removed attributeChangedCallback gives the value of null

            return '';
        }

        // First try a function since that can create any of the objects below
        if (value !== null &&
            value[value.length - 2] === '(' && value[value.length - 1] === ')' // The function by convention must end in ()
            && type.includes(Function)) {

            const fcn = getGlobalFunction(value);

            if (fcn !== undefined) {

                return fcn;
            }
        }

        // if (type.includes(ElementNode)) {

        //     return createVirtualNode(value);
        // }

        if (type.includes(Object) ||
            type.includes(Array)
        ) {

            let o;

            try {

                o = JSON.parse(value);
            }
            catch (error) {

                if (!type.includes(String)) {

                    throw error; // Malformed JSON
                }

                // Try the other types below
            }

            if (o !== undefined) {

                if (!Array.isArray(o) &&
                    !type.includes(Object)) {

                    throw Error(`value: ${value} is not an array but there is no object type expected`);
                }

                if (Array.isArray(o) &&
                    !type.includes(Array)) {

                    throw Error(`value: ${value} is an array but there is no array type expected`);
                }

                return o;
            }
        }

        if (type.includes(Boolean)) {

            return value !== null && value !== 'false';
        }

        if (type.includes(Number)) {

            return value === null ? null : Number(value);
        }

        return value;
    },

    toAttribute: (value: any) => {

        const type = typeof value;

        if (type === 'boolean') {

            return value ? 'true' : 'false';
        }

        if (type === 'object' || Array.isArray(value)) {

            return value == null ? value : JSON.stringify(value);
        }

        if (value === undefined ||
            value === null) {

            return `${value}`; // Convert undefined and null to string
        }

        return value;
    }

};

export default valueConverter;