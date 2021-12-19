import AppErrorHandler from "../../error/AppErrorHandler";
import ErrorHandler from "../../error/ErrorHandler";
import IntlProvider from "./services/IntlProvider";

/**
 * The singleton application controller so it is accessable from everywhere
 */
class AppCtrl {
	/**
	 * The auth provider of the application
	 */
	//authProvider?: AuthProvider;

	/**
	 * The error handler of the application
	 */
	errorHandler: ErrorHandler;

	/**
	 * The logged in user of the application
	 */
	//user?: AppUser;

	/**
	 * The internationalization provider of the app
	 */
	intlProvider?: IntlProvider;

	/**
	 * Initializes the application controller
	 */
	init() {

		console.log('Initializing appCtrl...');

		if ((window as any).getAppConfig !== undefined) {

			const {
				// auth,
				errorHandler,
				intl
			} = (window as any).getAppConfig();

			// if (auth !== undefined) {

			// 	appCtrl.authProvider = new OidcProvider(auth);
			// }

			if (intl !== undefined) {

				appCtrl.intlProvider = new IntlProvider(intl.lang, intl.data);
			}

			appCtrl.errorHandler = errorHandler !== undefined ?
				errorHandler :
				new AppErrorHandler();
		}
		else { // No configuration was provided

			appCtrl.errorHandler = new AppErrorHandler();
		}
	}
}

const appCtrl = new AppCtrl();

appCtrl.init();

export default appCtrl;