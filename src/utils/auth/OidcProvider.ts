import { UserManager } from 'oidc-client';
import { AuthProvider } from './interfaces';

export default class OidcProvider implements AuthProvider {

    _userManager: UserManager;

    constructor(cfg: any) {

        this._userManager = new UserManager(cfg);
    }

    login(): void {

        this._userManager.signinRedirect();
    }

    onLogin(success?: Function): void {

        if (success == undefined) {

            success = () => (window as any).location = "/";
        }

        this._userManager.signinRedirectCallback().then(user => {

            success!();

        }).catch(function (e) {

            console.error(e);
        });
    }

    logout(): void {

        this._userManager.signoutRedirect();
    }

    async getUser(): Promise<any | null> {

        return await this._userManager.getUser();
    }

    async authorize(): Promise<Record<string, string> | undefined> {

        const user = await this._userManager.getUser();

        if (user !== undefined) {

            return {
                "Authorization": "Bearer " + user!.access_token
            };
        }
    }
}