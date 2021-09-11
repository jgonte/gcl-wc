/**
 * Tracks the custom element metadata by the class type
 */

import { CustomElementMetadata } from "../interfaces";

// This is done to bypass weird behaviour with javascript regarding inherited static objects
const classMetadataRegistry = new Map<Function, CustomElementMetadata>();

export default classMetadataRegistry;