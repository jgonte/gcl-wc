import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../renderer/renderer";
import sliderCss from "./Slider-css"

export default class Slider extends CustomElement {

    static get properties() {

        return {

            /**
             * The value of the slider
             */
            value: {
                type: Number,
                value: 0,
                reflect: true,
                afterUpdate: function () { // Do not use an arrow function so we can use Function.prototype.call()

                    this.refreshSlider(this.value);
                }
            }
        }
    }

    static get styles() {

        return sliderCss;
    }

    render() {

        return html`
            <div class="bg-overlay"></div>
            <div class="thumb"></div>
        `;
    }

    async refreshSlider(value: number) {

        if (this.querySelector('.thumb')) {

            this.querySelector('.thumb').style.left = (value / 100 *
                this.offsetWidth -
                this.querySelector('.thumb').offsetWidth / 2)
                + 'px';
        }
    }

    connectedCallback() {

        super.connectedCallback?.();

        document.addEventListener('mousemove', e => this.eventHandler(e));

        document.addEventListener('mouseup', e => this.eventHandler(e));

        this.addEventListener('mousedown', e => this.eventHandler(e));

        // this.refreshSlider(this.value); 
        //                                  
        // this.setColor(this.backgroundcolor);
    }

    updateX(x) {

        // Offset the horizontal position to use the center of the thumbnail
        let hPos = x - this.querySelector('.thumb').offsetWidth / 2;

        // Restrict horizontal position to confines of component bounds
        if (hPos > this.offsetWidth) {

            hPos = this.offsetWidth;
        }

        if (hPos < 0) {

            hPos = 0;
        }

        // Calculate the percentage horizontal position and set the value attribute through the setter API
        this.value = (hPos / this.offsetWidth) * 100; 3
    }

    eventHandler(e) {

        const bounds = this.getBoundingClientRect();

        // Calculates horizontal position relative to left edge of the component
        const x = e.clientX - bounds.left;

        switch (e.type) {

            // Set a boolean to indicate the user is dragging, update the "value" attribute, and update the slider position
            case 'mousedown':
                {
                    this.isDragging = true;

                    this.updateX(x);

                    this.refreshSlider(this.value);
                }
                break;

            //Set the boolean to false to indicate the user is no longer dragging
            case 'mouseup':
                {
                    this.isDragging = false;
                }
                break;

            // If the boolean indicates the user is dragging, updates the “value” attribute and updates the slider position
            case 'mousemove':
                {
                    if (this.isDragging) {

                        this.updateX(x);

                        this.refreshSlider(this.value);
                    }
                }
                break;
        }
    }
}

defineCustomElement('gcl-slider', Slider);