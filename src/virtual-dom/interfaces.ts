// export interface VirtualNode {

//     /**
//      * The name of the tag of the node
//      */
//     tag: string,

//     /**
//      * The attributes of the node
//      */
//     attributes: Record<string, any>,

//     /**
//      * The children of the node
//      */
//     children: any[]

//     /**
//      * The DOM element of the node
//      */
//     $node?: Node;
// }

export interface EventHandler {

    /**
     * The name of the event handler
     */
    name: string;

    /**
     * The function that handles the event
     */
    handler: EventListenerOrEventListenerObject;
}

export enum DiffOperation {

    None = 1,
    Mount = 2,
    Update = 3,
    Unmount = 4
}

export interface LifecycleHooks {

    didMountCallback?: () => void;

    willUpdateCallback?: () => void;

    didUpdateCallback?: () => void;

    willUnmountCallback?: () => void;
}