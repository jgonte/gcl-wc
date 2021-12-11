export default function findParentAttribute(element: HTMLElement, name: string): string | undefined {

    let parent = element;

    do {

        const value = parent[name];

        if (value !== undefined &&
            value !== '') {

            return value;
        }

        parent = parent.parentElement;
        
    } while (parent != null);
}