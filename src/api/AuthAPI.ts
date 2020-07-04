import User, { UserBase } from '../models/User';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import { storeAuthentication, clearLogin } from '../auth';

type LoginPost = {
    user: UserBase & { password: string };
};

type RegisterPost = {
    user: UserBase & { password: string; password_confirmation: string };
};

type ConfirmationPost = { user: UserBase };
type ResetPasswordPatch = {
    user: { password: string; password_confirmation: string; reset_password_token: string };
};

async function requestAwaiter(requestPromise: Promise<unknown>): Promise<boolean> {
    try {
        await requestPromise;
        return true;
    } catch (_) {
        return false;
    }
}

export async function login(email: string, password: string): Promise<boolean> {
    let userID = '';
    let success = false;

    try {
        const user = await ApiRequest.postItem<LoginPost, User>(
            ApiPaths.USERS_LOGIN_PATH,
            { user: { email: email, password: password } },
            undefined,
        );
        email = user.email;
        userID = user.id;
        storeAuthentication(email, userID);
        success = true;
    } finally {
        return success;
    }
}

export function register(email: string, password: string, passwordConfirmation: string): Promise<boolean> {
    return requestAwaiter(
        ApiRequest.postItem<RegisterPost>(
            ApiPaths.USERS_REGISTRATIONS_PATH,
            { user: { email: email, password: password, password_confirmation: passwordConfirmation } },
            undefined,
        ),
    );
}

export async function logout(): Promise<boolean> {
    const success: boolean = await requestAwaiter(ApiRequest.deleteItem(ApiPaths.USERS_LOGOUT_PATH));
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

export function resetPassword(
    resetToken: string,
    newPassword: string,
    newPasswordConfirmation: string,
): Promise<boolean> {
    return requestAwaiter(
        ApiRequest.patchItem<ResetPasswordPatch>(ApiPaths.USERS_PASSWORD_RESET_PATH, {
            user: {
                reset_password_token: resetToken,
                password: newPassword,
                password_confirmation: newPasswordConfirmation,
            },
        }),
    );
}

export function sendPasswordResetRequest(email: string): Promise<boolean> {
    return requestAwaiter(
        ApiRequest.postItem<ConfirmationPost>(ApiPaths.USERS_PASSWORD_RESET_PATH, { user: { email: email } }),
    );
}
