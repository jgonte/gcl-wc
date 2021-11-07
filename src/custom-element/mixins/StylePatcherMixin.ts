import { NodePatchingData } from "../../renderer/NodePatcher";

/**
 * Patches the template with the style of the component if there is any
 * @param Base 
 * @returns 
 */
const StylePatcherMixin = Base =>

    class StylePatcher extends Base {

        /**
         * Whether the styles were already added to the document
         */
        protected stylesAdded: boolean = false;

        beforeRender(patchingData: NodePatchingData): NodePatchingData {

            const {
                constructor,
                stylesAdded: _stylesAdded = false
            } = this;

            const styles = (constructor as any).metadata.styles;

            if (styles.length > 0 &&
                _stylesAdded === false) { // Add a style element to the document

                patchingData = this.addStyles(patchingData, styles);

                this.stylesAdded = true;
            }

            return patchingData;
        }

        addStyles(node: NodePatchingData, styles: string[]): NodePatchingData {

            const {
                shadowRoot
            } = this;

            // Not optimal adding the same style sheet to the shadow root when the component is constructed
            // Better to add an adopted stylesheet but that is not widely supported by all the browsers
            // Or add the stylesheet to the template content since it is a static text but then the component can have different patching data
            // and we need to research the relation between component and patching data
            if (shadowRoot !== null) {

                const styleNode = document.createElement('style');

                const styleContent = document.createTextNode(styles.join(''));

                styleNode.appendChild(styleContent);

                shadowRoot.appendChild(styleNode); // Append the style
            }
            else { // this.shadowRoot === null

                throw Error('Not implemented'); // Maybe append the style to the parent document/ shadow root? More research when we encounter the specific scenario
            }

            return node;
        }
    }


export default StylePatcherMixin;