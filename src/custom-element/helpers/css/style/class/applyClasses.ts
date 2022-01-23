export default function applyClasses(element: HTMLElement, props: Record<string, boolean>): void {
    
    for (const key in props) {

        if (props.hasOwnProperty(key)) {

            if (props[key] === true) {

                element.classList.add(key);
            }
            else {

                element.classList.remove(key);
            }
        }
    }
}