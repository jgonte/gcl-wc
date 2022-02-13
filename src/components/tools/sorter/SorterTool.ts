import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../../../custom-element/interfaces";
import Tool from "../Tool";

export const sorterChanged = 'sorterChanged';

export default class SorterTool extends Tool {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field to sort
             */
            field: {
                type: String,
                required: true
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            ascending: {
                value: undefined
            }
        };
    }

    iconName = () => {

        const {
            ascending
        } = this;

        if (ascending === undefined) {

            return 'arrow-down-up';
        }

        return ascending === true ?
            'arrow-up' :
            'arrow-down';
    }

    click = () => {

        let {
            ascending,
            field
        } = this;

        ascending = !ascending;

        this.ascending = ascending;

        this.dispatchEvent(new CustomEvent(sorterChanged, {
            detail: {
                field,
                ascending,
                sorterElement: this // Send this element to track the current sorter
            },
            bubbles: true,
            composed: true
        }));

    };
}

defineCustomElement('gcl-sorter-tool', SorterTool);