import ApiPaths from './routes/ApiPaths';
import ApiRequest from './api/apiRequests';
import { AxiosResponse } from 'axios';
import * as MiniSignal from 'mini-signals';
import User, { UserBase } from './models/User';

namespace Auth {
    const emailKey: string = 'email';
    const idKey: string = 'id';
    const signedInKey: string = 'signedIn';

    type LoginPost = {
        user: UserBase & { password: string };
    };

    const unauthenticatedSignal: MiniSignal = new MiniSignal();

    export function setOnAuthFailure(subscriber: Function): MiniSignal.MiniSignalBinding {
        return unauthenticatedSignal.add(subscriber);
    }

    ApiRequest.subscribeToFailureCode({
        code: 401,
        callback: () => {
            clearLogin();
            unauthenticatedSignal.dispatch();
        },
    });

    export function isLoggedIn(): boolean {
        return localStorage.getItem(signedInKey) === 'true';
    }

    export function getEmail(): string {
        return localStorage.getItem(emailKey) || '';
    }

    export function getUserId(): string {
        return localStorage.getItem(idKey) || '';
    }

    export function login(email: string, password: string, callback?: (success: boolean) => void) {
        let userID: string = '';
        let success: boolean = false;

        ApiRequest.postItem<LoginPost, User>(
            ApiPaths.usersLoginPath,
            { user: { email: email, password: password } },
            undefined,
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
        const response: Promise<AxiosResponse> = ApiRequest.deleteItem(ApiPaths.usersLogoutPath, undefined);
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
}

export default Auth;
