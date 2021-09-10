import { CustomElementStateMetadata } from "../interfaces";

const StateMetadataInitializerMixin = Base =>

    class StateMetadataInitializer extends Base {

        /**
         * The state to track in the class
         */
        static state: Record<string, CustomElementStateMetadata>;

        protected static initializeState(): void {

            const {
                state
            } = this;

            if (state === undefined) {

                return;
            }

            Object.entries(state).forEach(([name, stateMetadata]) => {

                (stateMetadata as CustomElementStateMetadata).name = name; // Set the name of the state property

                Object.defineProperty(
                    this.prototype,
                    name,
                    {
                        get(): any {

                            return this._state[name];
                        },
                        set(this: any, value: unknown) {

                            this.setState(name, value);
                        },
                        configurable: true,
                        enumerable: true,
                    }
                );
            });
        }
    }

export default StateMetadataInitializerMixin;