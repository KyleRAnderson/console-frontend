import ApiPaths from './routes/ApiPaths';
import ApiRequest from './apiRequests';
namespace Auth {
    const emailKey: string = 'email';
    const tokenKey: string = 'token';
    const idKey: string = 'id';

    type UserResponse = {
        id: string;
        email: string;
    };

    type LoginPost = {
        user: {
            email: string;
            password: string;
        };
    };

    let subscribers: AuthFailureSubscriber[] = [];

    export type AuthFailureSubscriber = () => void;

    export function onAuthFailure(subscriber: AuthFailureSubscriber): void {
        subscribers.push(subscriber);
    }

    export function removeAuthFailureSubscription(subscriber: AuthFailureSubscriber): void {
        subscribers = subscribers.filter((s) => s !== subscriber);
    }

    ApiRequest.subscribeToFailureCode({ callback: callAuthFailureSubscribers, code: 401 });

    function callAuthFailureSubscribers() {
        clearLogin();
        subscribers.forEach((subscriber) => subscriber());
    }

    export function isLoggedIn(): boolean {
        return getToken().length > 0;
    }

    export function getToken(): string {
        return localStorage.getItem(tokenKey) || '';
    }

    export function getEmail(): string {
        return localStorage.getItem(emailKey) || '';
    }

    export function getUserId(): string {
        return localStorage.getItem(idKey) || '';
    }

    export function getCSRFToken(): string | undefined {
        return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    }

    export function login(email: string, password: string, callback?: (success: boolean) => void) {
        let authToken: string = '';
        let userID: string = '';
        let success: boolean = false;

        ApiRequest.postItem<LoginPost, UserResponse>(
            ApiPaths.usersLoginPath,
            { user: { email: email, password: password } },
            undefined,
            false,
        )
            .then((response) => {
                success = true;
                authToken = response.headers.authorization;
                email = response.data.email;
                userID = response.data.id;
                storeAuthentication(email, authToken, userID);
            })
            .finally(() => {
                if (callback) {
                    callback(success);
                }
            });
    }

    export function logout(callback?: () => void) {
        ApiRequest.deleteItem(ApiPaths.usersLogoutPath, undefined, false).then(callback);
        clearLogin();
    }

    export function clearLogin(): void {
        localStorage.removeItem(emailKey);
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(idKey);
    }

    function storeAuthentication(email: string, authToken: string, userID: string) {
        localStorage.setItem(emailKey, email);
        localStorage.setItem(tokenKey, authToken);
        localStorage.setItem(idKey, userID);
    }

    export function getRequestHeaders(
        includeAuth: boolean = true,
    ): { Authorization?: string; 'X-CSRF-Token'?: string; 'Content-Type': string } {
        const authHeader: { Authorization?: string } = includeAuth ? { Authorization: getToken() } : {};
        return {
            ...authHeader,
            'X-CSRF-Token': getCSRFToken(),
            'Content-Type': 'application/json',
        };
    }
}
export default Auth;
