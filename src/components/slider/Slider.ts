import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";

export default class Slider extends CustomElement {

    connectedCallback() {

        this.innerHTML = '<div class="bg-overlay"></div><div class="thumb"></div>';
    }
}

defineCustomElement('gcl-slider', Slider);