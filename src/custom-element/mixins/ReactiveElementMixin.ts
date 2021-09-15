/**
 * Mixin to trigger updates when the properties or the state change
 * @param Base 
 * @returns 
 */
const ReactiveElementMixin = Base =>

    class ReactiveElement extends Base {
        
        /**
         * Flag to avoid re-requesting update if it is alaready requested
         */
        private _isUpdating: boolean = false;

        protected setProperty(name: string, value: any): void {

            if (super.setProperty?.(name, value) === true) {

                this.update();
            }
        }

        protected setState(key: string, value: any): void {

            if (super.setState?.(key, value) === true) {

                this.update();
            }
        }

        protected update() {

            if (this._isUpdating) {

                return;
            }

            this._isUpdating = true;

            requestAnimationFrame(() => {

                this.doUpdate();

                this._isUpdating = false;
            });
        }  
    }

export default ReactiveElementMixin;