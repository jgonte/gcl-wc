/**
 * Mixin to trigger updates when the properties or the state change
 * @param Base 
 * @returns 
 */
const ReactiveElementMixin = Base =>

    class ReactiveElement extends Base {

        /**
         * Flag that tests if there is an update in progress so no other updates are requested
         */
        private _hasPendingUpdate: boolean = false;

        /**
         * Promise to schedule the updates
         */
        private _updatePromise: Promise<void> = new Promise<void>((resolve, reject) => resolve()); // Finished updating by default

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

        /**
         * Requests the custom element to be updated
         */
        protected update(): void {

            if (this._hasPendingUpdate) {

                return;
            }

            this._updatePromise = this._enqueueUpdate();
        }

        private async _enqueueUpdate(): Promise<void> {

            this._hasPendingUpdate = true;

            try {

                await this._updatePromise; // Wait for the previous update to finish
            }
            catch (error) {

                Promise.reject(error);
            }

            return new Promise<void>((resolve, reject) => {

                this.updateDom();

                this._markUpdated();

                resolve();
            });
        }

        private _markUpdated() {

            this._hasPendingUpdate = false;

            this.clearChangedProperties();
        }

        get updateComplete(): Promise<void> {

            return this._updatePromise;
        }

        protected didMount() {

            this.callAttributesChange();
        }

        protected didUpdate() {

            this.callAttributesChange();
        }
    }

export default ReactiveElementMixin;