import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import Tool from "../Tool";

export default class CloseTool extends Tool {

    constructor() {

        super();
        
        this.iconName = "x";
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
            close: {
                type: Function,
                required: true
            }
        };
    }

    click() {

        this.close?.();
    }
}

defineCustomElement('gcl-close-tool', CloseTool);