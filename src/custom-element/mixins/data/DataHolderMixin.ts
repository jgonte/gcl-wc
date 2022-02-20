import { CustomElementPropertyMetadata } from "../../interfaces";

/**
 * Mixin for a component that holds a collection of records
 * @param Base 
 * @returns 
 */
const DataHolderMixin = Base =>

    /**
     * Implements a mixin that loads a single record
     */
    class DataHolder extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The collection of records to render
                 */
                data: {
                    type: [Array, Function],
                    value: []
                    //required: true - We might need to load it after connecting the component
                },

                /**
                 * The field that provides a unique id for the record
                 */
                idField: {
                    attribute: 'id-field',
                    type: String,
                    required: true
                }
            }
        }
    }

export default DataHolderMixin;