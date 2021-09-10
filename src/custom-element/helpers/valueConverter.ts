import getGlobalFunction from "./getGlobalFunction";
import { OneOf } from "./oneOf";

const valueConverter = {

    toProperty: (value: string, type: Function) => {

        if (type instanceof OneOf) {

            return type.toProperty(value);
        }

        switch (type) {

            case Boolean:

                return value !== null && value !== 'false';

            case Number:

                return value === null ? null : Number(value);

            case Array:
                {
                    // All the properties that are not declared as Function accept a function as alternative by design
                    // The probing is as follows: 
                    // Test whether it is really an array
                    try {

                        return JSON.parse(value);
                    }
                    catch (error) {// Value is a string but not a JSON one, assume a function

                        return getGlobalFunction(value);
                    }
                }

            // case ElementNode: {

            //     return createVirtualNode(value);
            // }

            case Function: { // Extract the string and return the global function

                return getGlobalFunction(value);
            }

            case Object: // It can also be a string

                try {

                    value = JSON.parse(value);
                }
                catch (error) {

                    return value;
                }
        }

        return value;
    },

    toAttribute: (value: any) => {

        const type = typeof value;

        if (type === 'boolean') {

            return value ? '' : 'false';
        }
        else if (type === 'object' || Array.isArray(value)) {

            return value == null ? value : JSON.stringify(value);
        }
        else {

            return value;
        }
    }

};

export default valueConverter;