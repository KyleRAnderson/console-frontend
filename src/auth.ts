import ApiPaths from './routes/ApiPaths';
import ApiRequest from './api/apiRequests';
import { AxiosResponse } from 'axios';

namespace Auth {
    const emailKey: string = 'email';
    const idKey: string = 'id';
    const signedInKey: string = 'signedIn';

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
        return localStorage.getItem(signedInKey) === 'true';
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
                email = response.data.email;
                userID = response.data.id;
                storeAuthentication(email, userID);
                callback?.(success);
            })
            .catch(() => {
                callback?.(success);
            });
    }

    export function logout(): Promise<AxiosResponse> {
        const response: Promise<AxiosResponse> = ApiRequest.deleteItem(ApiPaths.usersLogoutPath, undefined, false);
        clearLogin();
        return response;
    }

    export function clearLogin(): void {
        localStorage.removeItem(emailKey);
        localStorage.removeItem(signedInKey);
        localStorage.removeItem(idKey);
    }

    function storeAuthentication(email: string, userID: string) {
        localStorage.setItem(emailKey, email);
        localStorage.setItem(signedInKey, true.toString());
        localStorage.setItem(idKey, userID);
    }

    export function getRequestHeaders(): { 'X-CSRF-Token'?: string; 'Content-Type': string } {
        return {
            'X-CSRF-Token': getCSRFToken(),
            'Content-Type': 'application/json',
        };
    }
}
export default Auth;
