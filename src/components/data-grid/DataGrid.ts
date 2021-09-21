import { CustomElement } from "../..";
import html from "../../virtual-dom/html";
import { config } from "../config";
import styles from "./DataGrid-css";

export default class DataGrid extends CustomElement {

    static get styles() {

        return styles;
    }

    render() {

        return html`
            ${this.renderHeader()}
        `;
    }

    renderHeader() {

        return html`<div class="tr th">
        <div class="td"
          style="flex-grow: 2;">
          Name
        </div>
        <div class="td">
          Items Bought
        </div>
        <div class="td">
          Clicked
        </div>
        <div class="td">
          Duration
        </div>
        <div class="td">
          Lifetime Total
        </div>
        <div class="td">
          Total
        </div>
      </div>
      <div class="tr table-total">
        <div class="td"
          style="flex-grow: 2;">
          <b>Total</b>
        </div>
        <div class="td"
          style="justify-content: center;">
          <b>4102</b>
        </div>
        <div class="td"
          style="justify-content: center;">
          <b>2914</b>
        </div>
        <div class="td"
          style="justify-content: center;">
          <b>1341</b>
        </div>
        <div class="td"
          style="justify-content: flex-end;">
          <b>$12,118,329.15</b>
        </div>
        <div class="td"
          style="justify-content: flex-end;">
          <b>$4,036,930.16</b>
        </div>
      </div>`;
    }
}

customElements.define(`${config.tagPrefix}-data-grid`, DataGrid as any);