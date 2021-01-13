import * as ApiRequest from './api/apiRequests';
import MiniSignal from 'mini-signals';

export const PASSWORD_MAX_LENGTH = 128,
    PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_REGEX = new RegExp(
    `^[A-Za-z0-9\.!@#$%\^&\*\(\)_\+\-=]{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}$`,
);

const emailKey = 'email';
const idKey = 'id';
const signedInKey = 'signedIn';

const unauthenticatedSignal: MiniSignal = new MiniSignal();

export function setOnAuthFailure(subscriber: () => void): MiniSignal.MiniSignalBinding {
    return unauthenticatedSignal.add(subscriber);
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

export function clearLogin(): void {
    localStorage.removeItem(emailKey);
    localStorage.removeItem(signedInKey);
    localStorage.removeItem(idKey);
}

export function storeAuthentication(email: string, userID: string): void {
    localStorage.setItem(emailKey, email);
    localStorage.setItem(signedInKey, true.toString());
    localStorage.setItem(idKey, userID);
}
ApiRequest.subscribeToFailureCode({
    code: 401,
    callback: () => {
        clearLogin();
        unauthenticatedSignal.dispatch();
    },
});
