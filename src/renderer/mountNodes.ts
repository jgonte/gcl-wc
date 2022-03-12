import { createNodes } from "./createNodes";
import { NodePatchingData } from "./NodePatcher";

export function mountNodes(container: Node, patchingData: NodePatchingData | NodePatchingData[]) {

    if (Array.isArray(patchingData)) {

        patchingData.forEach(pd => container.appendChild(createNodes(pd)));
    }
    else {

        container.appendChild(createNodes(patchingData));   
    }   
}