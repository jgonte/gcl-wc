import CustomElement from "../../custom-element/CustomElement";
import applyClasses from "../../custom-element/helpers/css/style/class/applyClasses";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import styles from "./ToolTip.css";

export default class ToolTip extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The position of the tool tip
             */
            position: {
                type: String,
                value: 'bottom',
                options: ['top', 'bottom', 'left', 'right']
            }
        };
    }

    render(): NodePatchingData {

        return html`<div class="container">
            <span id="trigger">
                <slot name="trigger"></slot>
            </span>       
            <span id="content">
                <slot name="content"></slot>
            </span>
        </div>`;
    }

    connectedCallback(): void {
        
        super.connectedCallback?.();

        // TODO: Create a global (singleton) resize manager and subscribe to it
        // Also re-position when scroll has occurred
        window.addEventListener('resize', () => this.handleResize());
    }

    didMountCallback() {

        this._positionContent();
    }

    didUpdateCallback() {

        this._positionContent();
    }

    handleResize() {

        this._positionContent();
    }

    /**
     * Positions the content since we don't know its dimensions until it is rendered in the DOM
     */
    private _positionContent() {

        const trigger = this.document.getElementById("trigger");

        const content = this.document.getElementById("content");

        const p = this.getFittingPosition(trigger, content, this.position); // Get the position from the trigger
        
        applyClasses(content, { // Keep or update the position of the content
            'top': p === 'top',
            'bottom': p === 'bottom',
            'left': p === 'left',
            'right': p === 'right',
        });
    }

    /**
     * Returns the requested position if there is enough room for that
     * @param trigger 
     * @param pos 
     * @returns 
     */
    getFittingPosition(trigger: HTMLElement, content: HTMLElement, pos: string) {

        const {
            clientWidth,
            clientHeight
        } = document.documentElement;

        const {
            x: triggerX,
            y: triggerY,
            height: triggerHeight,
            width: triggerWidth
        } = trigger.getBoundingClientRect();

        const {
            height: contentHeight,
            width: contentWidth
        } = content.getBoundingClientRect();

        switch (pos) {
            case 'top':
                {
                    pos = triggerY < triggerHeight ? 'bottom' : 'top';
                }
                break;
            case 'bottom':
                {
                    pos = triggerY + triggerHeight + contentHeight> clientHeight ? 'top' : 'bottom';
                }
                break;
            case 'left':
                {
                    pos = triggerX < triggerWidth ? 'right' : 'left';
                }
                break;
            case 'right':
                {
                    pos = triggerX + triggerWidth + contentWidth > clientWidth ? 'left' : 'right';
                }
                break;
        }

        return pos;
    }
}

defineCustomElement('gcl-tool-tip', ToolTip);