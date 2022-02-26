/**
 * Returns the first child whose evaluation by predicate returns true
 * @param children 
 * @param predicate 
 * @returns The first HTMLElement for which the predicate function returns true
 */
export default function findChild(children: HTMLCollection, predicate: Function) : Element {

    if (children.length == 0) {

        return null;
    }

    for (let i = 0; i < children.length; ++i) {

        let child = children[i];

        if (predicate(child) === true) {

            return child;
        }

        child = findChild(child.children, predicate)

        if (child !== null) {

            return child;
        }      
    }
}