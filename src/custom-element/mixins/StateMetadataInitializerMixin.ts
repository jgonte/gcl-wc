import { CustomElementMetadata, CustomElementStateMetadata } from "../interfaces";

const StateMetadataInitializerMixin = Base =>

    class StateMetadataInitializer extends Base {

        /**
         * The state to track in the class
         */
        static state: () => Record<string, CustomElementStateMetadata>;

        protected static initializeState(metadata: CustomElementMetadata): void {

            const {
                state
            } = this;

            if (state === undefined) {

                return;
            }

            Object.entries(state).forEach(([name, stateMetadata]) => {

                stateMetadata.name = name; // Set the name of the state property

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

                // Add it to the metadata properties so the properties of the instances can be validated and initialized
                metadata.state.set(name, stateMetadata);

            });

            // Add the properties of the state base class if any so we can validate and initialize
            // the values of the properties of the state of the base class in the instance
            let baseClass = Object.getPrototypeOf(this.prototype)?.constructor;

            if (baseClass !== undefined) {

                const baseClassMetadata = baseClass.metadata;

                if (baseClassMetadata !== undefined) {

                    metadata.state = new Map([...metadata.state, ...baseClassMetadata.state]);
                }
                // else { // Loop and copy the states of the mixins

                //     do {

                //         if (baseClass.state !== undefined) {

                //             metadata.state = new Map([...metadata.state, ...Object.entries(baseClass.state) as any]);
                //         }

                //         baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;

                //     } while (baseClass._isCustomElement === true);
                // }
            }
        }
    }

export default StateMetadataInitializerMixin;