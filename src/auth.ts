import ApiPaths from './routes/ApiPaths';
import ApiRequest from './api/apiRequests';
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

    export async function login(email: string, password: string): Promise<boolean> {
        let userID: string = '';
        let success: boolean = false;

        try {
            const response = await ApiRequest.postItem<LoginPost, User>(
                ApiPaths.USERS_LOGIN_PATH,
                { user: { email: email, password: password } },
                undefined,
            );
            success = true;
            email = response.data.email;
            userID = response.data.id;
            storeAuthentication(email, userID);
            success = true;
        } finally {
            return success;
        }
    }

    export async function logout(): Promise<boolean> {
        try {
            await ApiRequest.deleteItem(ApiPaths.USERS_LOGOUT_PATH, undefined);
            console.log('Success');
            clearLogin();
            return true;
        } catch (_) {
            return false;
        }
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
