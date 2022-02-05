import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementStateMetadata } from "../../../custom-element/interfaces";
import Tool from "../Tool";

export const dropChanged = 'dropChanged';

export default class DropTool extends Tool {

    constructor() {

        super();

        this.updateShowing = this.updateShowing.bind(this);
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            showing: {
                value: false
            }
        };
    }

    iconName = () => {

        const {
            showing
        } = this;

        if (showing === undefined) {

            return 'chevron-down';
        }

        return showing === true ?
            'chevron-up' :
            'chevron-down';
    }

    hideContent() {

        this.updateShowing(false);
    }

    updateShowing(showing: boolean) : void {

        this.showing = showing;

        this.dispatchEvent(new CustomEvent(dropChanged, {
            detail: {
                showing,
                dropElement: this // To track the element in a container/manager if needed
            },
            bubbles: true,
            composed: true
        }));
    }

    click = () => {

        let {
            showing
        } = this;

        showing = !showing;

        this.updateShowing(showing);
    };
}

defineCustomElement('gcl-drop-tool', DropTool);