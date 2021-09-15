export interface VirtualNode {

    /**
     * The name of the tag of the node
     */
    tag: string,

    /**
     * The attributes of the node
     */
    attributes: Record<string, any>,

    /**
     * The children of the node
     */
    children: any[]

    /**
     * The DOM element of the node
     */
    $node?: Node;
}