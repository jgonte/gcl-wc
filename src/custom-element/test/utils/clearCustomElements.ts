/**
 * Helper to clear the registry of custom elements after each test
 */
export default function clearCustomElements() {

    // Clear the registration
    (customElements as any)._registry = {};

    // Clear the body
    document.body.innerHTML = '';
}