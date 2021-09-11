import classMetadataRegistry from "../helpers/classMetadataRegistry";
import { CustomElementStateMetadata } from "../interfaces";
import StateMetadataInitializerMixin from "./StateMetadataInitializerMixin";

const StateChangeHandlerMixin = Base =>

    class StateChangeHandler extends StateMetadataInitializerMixin(Base) { // This mixin requires an implementation of setState

        /**
         * The state of the instance
         */
         private _state: Record<string, any> = {};

        /**
         * Initializes the state that have a default value
         * @param stateMetadata 
         */
        private _initializeStateWithDefaultValues(stateMetadata: Map<string, CustomElementStateMetadata>) {

            for (const [name, state] of stateMetadata) {

                const {
                    value
                } = state;

                if (this._state[name] === undefined &&
                    value !== undefined) {

                    this.setState(name, value);
                }
            }
        }

        connectedCallback() {

            super.connectedCallback?.();

            this._initializeStateWithDefaultValues(classMetadataRegistry.get(this.constructor).state);
        }

        setState(key: string, value: any): boolean {

            // Verify that the property of the state is one of the configured in the custom element
            if (classMetadataRegistry.get(this.constructor).state.get(key) === undefined) {

                throw Error(`There is no configured property for state: '${key}' in type: '${this.constructor.name}'`)
            }

            const oldValue = this._state[key];

            if (oldValue === value) {

                return false;
            }

            this._state[key] = value;

            return true;
        }

    }

export default StateChangeHandlerMixin;
