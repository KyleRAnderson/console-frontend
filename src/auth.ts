import ApiPaths from './routes/ApiPaths';
import ApiRequest from './api/apiRequests';
import * as MiniSignal from 'mini-signals';
import User, { UserBase } from './models/User';
import { AxiosResponse } from 'axios';

namespace Auth {
    export namespace PasswordValidation {
        export const MAX_LENGTH = 128,
            MIN_LENGTH = 6;
        export const REGEX: RegExp = new RegExp(`^[A-Za-z0-9\.!@#$%\^&\*\(\)_\+\-=]{${MIN_LENGTH},${MAX_LENGTH}}$`);
    }

    const emailKey: string = 'email';
    const idKey: string = 'id';
    const signedInKey: string = 'signedIn';

    type LoginPost = {
        user: UserBase & { password: string };
    };

    type RegisterPost = {
        user: UserBase & { password: string; password_confirmation: string };
    };

    type ConfirmationPost = { user: UserBase };

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
            email = response.data.email;
            userID = response.data.id;
            storeAuthentication(email, userID);
            success = true;
        } finally {
            return success;
        }
    }

    export function register(email: string, password: string, passwordConfirmation: string): Promise<boolean> {
        return requestAwaiter(
            ApiRequest.postItem<RegisterPost>(
                ApiPaths.USERS_LOGIN_PATH,
                { user: { email: email, password: password, password_confirmation: passwordConfirmation } },
                undefined,
            ),
        );
    }

    export async function logout(): Promise<boolean> {
        let success: boolean = await requestAwaiter(ApiRequest.deleteItem(ApiPaths.USERS_LOGOUT_PATH));
        if (success) {
            clearLogin();
        }
        return success;
    }

    export function confirm(token: string): Promise<boolean> {
        return requestAwaiter(
            ApiRequest.getItem(ApiPaths.USERS_CONFIRMATION_PATH, { params: { confirmation_token: token } }),
        );
    }

    export function resendConfirmation(emailAddress: string): Promise<boolean> {
        return requestAwaiter(
            ApiRequest.postItem<ConfirmationPost>(ApiPaths.USERS_CONFIRMATION_PATH, {
                user: { email: emailAddress },
            }),
        );
    }

    export async function confirm(token: string): Promise<boolean> {
        try {
            await ApiRequest.getItem(ApiPaths.USERS_CONFIRMATION_PATH, { params: { confirmation_token: token } });
            return true;
        } catch (_) {
            return false;
        }
    }

    async function requestAwaiter(requestPromise: Promise<AxiosResponse<any>>): Promise<boolean> {
        try {
            await requestPromise;
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
