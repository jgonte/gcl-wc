import styles from "./DirectionMixin.css";

const DirectionMixin = Base =>

    class Direction extends Base {

        static get styles(): string {

            return [super.styles, styles].join('');
        }

        get dir(): string {

            return super.dir || document.dir;
        }
    };

export default DirectionMixin;