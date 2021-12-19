import ErrorHandler, { errorEvent } from "./ErrorHandler";

export default class AppErrorHandler implements ErrorHandler {

    constructor() {

        document.addEventListener(errorEvent, this.handleError);
    }

    handleError(event: CustomEvent): void {

        const {
            error
        } = event.detail;

        alert(error.message);
    }
}