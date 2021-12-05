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
	//onError?: (error: Error) => void;

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

		console.log('Initializing appCtrl');

		if ((window as any).getAppConfig !== undefined) {

			const {
				// auth,
				intl
			} = (window as any).getAppConfig();

			// if (auth !== undefined) {

			// 	appCtrl.authProvider = new OidcProvider(auth);
			// }

			if (intl !== undefined) {

				appCtrl.intlProvider = new IntlProvider(intl.lang, intl.data);
			}
		}
	}
}

const appCtrl = new AppCtrl();

appCtrl.init();

export default appCtrl;