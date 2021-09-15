import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";

export default class Slider extends CustomElement {

    static get properties() {

        return {

            /**
             * The value of the slider
             */
            value: {
                type: Number,
                value: 0,
                change: function () { // Do not use an arrow function so we can use Function.prototype.call()

                    this.refreshSlider(this.value);
                }
            }
        }
    }

    connectedCallback() {

        this.innerHTML = '<div class="bg-overlay"></div><div class="thumb"></div>';
    }

    refreshSlider(value: number) {

        if (this.querySelector('.thumb')) {

            this.querySelector('.thumb').style.left = (value / 100 *
                this.offsetWidth -
                this.querySelector('.thumb').offsetWidth / 2)
                + 'px';
        }
    }
}

defineCustomElement('gcl-slider', Slider);