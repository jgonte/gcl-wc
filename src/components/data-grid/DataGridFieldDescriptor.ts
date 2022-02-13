import { NodePatchingData } from "../../renderer/NodePatcher";

export default interface DataGridFieldDescriptor {

    /**
     * The name of the field
     */
    name: string;

    /**
     * The display (label) of the field
     */
    display: string | Function;

    /**
     * The CSS width of the field
     */
    width: string;

    /**
     * Whether the field can be sorted
     */
    sortable: boolean;

    /**
     * The style for the header of the field (column)
     */
    headerStyle: string | object;

    /**
     * The custom renderer of the field
     */
    render: (record: Record<string, any>, field: DataGridFieldDescriptor) => NodePatchingData;
}