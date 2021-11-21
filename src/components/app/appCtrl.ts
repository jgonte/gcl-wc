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

    }

    /**
     * Destroyes the application controller
     */
    destroy() {

    }
  }
  
  const appCtrl = new AppCtrl();
  
  export default appCtrl;