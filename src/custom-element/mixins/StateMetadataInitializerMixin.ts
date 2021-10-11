import { CustomElementMetadata, CustomElementStateMetadata } from "../interfaces";

const StateMetadataInitializerMixin = Base =>

    class StateMetadataInitializer extends Base {

        static readonly _isMetadataInitializer = true;

        /**
         * The state to track in the class
         */
        static state: () => Record<string, CustomElementStateMetadata>;

        protected static initializeState(metadata: CustomElementMetadata): void {

            const state = this.getAllState();

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

                // Add it to the metadata properties so the properties of the instances can be validated and initialized
                metadata.state.set(name, stateMetadata as CustomElementStateMetadata);
            });

            // Add the properties of the state base class if any so we can validate and initialize
            // the values of the properties of the state of the base class in the instance
            let baseClass = Object.getPrototypeOf(this.prototype)?.constructor;

            if (baseClass !== undefined) {

                const baseClassMetadata = baseClass.metadata;

                if (baseClassMetadata !== undefined) {

                    metadata.state = new Map([...metadata.state, ...baseClassMetadata.state]);
                }
            }
        }

        /**
         * Retrieve the state of this and the base mixins
         * @returns The merged state
         */
        static getAllState(): Record<string, CustomElementStateMetadata> {

            let state = this.state || {};

            let baseClass = Object.getPrototypeOf(this.prototype)?.constructor;

            while (baseClass._isMetadataInitializer === true) {

                if (baseClass.state !== undefined) {

                    state = { ...state, ...baseClass.state };
                }

                baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;
            }

            return state;
        }
    }

export default StateMetadataInitializerMixin;