import { Field } from "../Field";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { html } from "../../../renderer/html";

function formatSize(fileSize) {

    if (fileSize < 1024) {

        return fileSize + 'bytes';
    }
    else if (fileSize >= 1024 && fileSize < 1048576) {

        return (fileSize / 1024).toFixed(1) + 'KB';
    }
    else if (fileSize >= 1048576) {

        return (fileSize / 1048576).toFixed(1) + 'MB';
    }
}

export default class FileField extends Field {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            accept: {
                type: String
            },

            capture: {
                type: Boolean,
                value: true
            },

            multiple: {
                type: Boolean
            },

            /** Whether to preview the files (that can be previewed) */
            preview: {
                type: Boolean
            }
        };
    }

    render(): NodePatchingData {

        const {
            name,
            //value,
            accept,
            capture,
            multiple,
            //required,
            disabled,
            //preview
        } = this;

        // Note: opacity is used to hide the file input instead of visibility: hidden or display: none, because assistive technology interprets the latter two styles to mean the file input isn't interactive.

        return html`
            <input
                style="opacity: 0; position: absolute;"
                type="file"
                name=${name}
                id=${name}
                accept=${accept}
                capture=${capture}
                multiple=${multiple}
                disabled=${disabled}
                onInput=${event => this.handleInput(event)}
                onChange=${event => this.handleChange(event)}
                onBlur=${event => this.handleBlur(event)}
            />

            ${this.renderFileList()}

            <gcl-button kind="secondary" variant="contained" click=${() => this.openFileDialog()}>
                <gcl-icon name="upload"></gcl-icon>
                <gcl-localized-text>Click here to upload files</gcl-localized-text>
            </gcl-button>`;
    }

    openFileDialog(): void {

        const {
            name
        } = this;

        this.document.getElementById(name).click();
    }

    renderFileList(): NodePatchingData[] {

        const {
            preview,
            value,
        } = this;

        if (preview === false) {

            return null;
        }

        if (value === undefined) {

            return null;
        }

        const data = Array.isArray(value) ? value : [value]; // Ensure it is an array

        return data.map(record => {

            const {
                name,
                content,
                size
            } = record;

            // The content can be either read from the server or selected from a File object
            const src = content.indexOf('blob:') === -1 ?
                `data:image/jpeg;base64,${content}` :
                content;

            return html`
                <gcl-row value={name}>
                    <img style="width: 48px; height: 48px;" src=${src} />
                    <span>${name}</span>
                    <span>${formatSize(size)}</span>     
                </gcl-row>`;
        });
    }
}

defineCustomElement('gcl-file-field', FileField);