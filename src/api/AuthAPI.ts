import { AxiosResponse } from 'axios';
import { clearLogin, storeAuthentication } from '../auth';
import User, { UserBase } from '../models/User';
import * as ApiPaths from '../routes/ApiPaths';
import * as ApiRequest from './apiRequests';

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
type UpdatePasswordPatch = {
    user: { current_password: string; password: string; password_confirmation: string };
};

export async function login(email: string, password: string): Promise<boolean> {
    let userID = '';
    let success = false;

    await ApiRequest.getItem(ApiPaths.API_ROOT_PATH);

    try {
        const { data: user } = await ApiRequest.postItem<LoginPost, User>(
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

export function register(email: string, password: string, passwordConfirmation: string) {
    return ApiRequest.postItem<RegisterPost, User>(
        ApiPaths.USERS_REGISTRATIONS_PATH,
        { user: { email: email, password: password, password_confirmation: passwordConfirmation } },
        undefined,
    );
}

export async function logout() {
    const response = await ApiRequest.deleteItem(ApiPaths.USERS_LOGOUT_PATH);
    /* If the request errors, then an exception will be thrown and the clearLogin() logic won't run. Thus, it only
    clears login on success. */
    clearLogin();
    return response;
}

export function confirm(token: string) {
    return ApiRequest.getItem(ApiPaths.USERS_CONFIRMATION_PATH, { params: { confirmation_token: token } });
}

export function resendConfirmation(emailAddress: string) {
    return ApiRequest.postItem<ConfirmationPost>(ApiPaths.USERS_CONFIRMATION_PATH, {
        user: { email: emailAddress },
    });
}

export function resetPassword(
    resetToken: string,
    newPassword: string,
    newPasswordConfirmation: string,
): Promise<AxiosResponse<void>> {
    return ApiRequest.patchItem<ResetPasswordPatch>(ApiPaths.USERS_PASSWORD_RESET_PATH, {
        user: {
            reset_password_token: resetToken,
            password: newPassword,
            password_confirmation: newPasswordConfirmation,
        },
    });
}

export function updatePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    return ApiRequest.patchItem<UpdatePasswordPatch>(ApiPaths.USERS_REGISTRATIONS_PATH, {
        user: {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: newPasswordConfirmation,
        },
    });
}

export function sendPasswordResetRequest(email: string): Promise<AxiosResponse<void>> {
    return ApiRequest.postItem<ConfirmationPost>(ApiPaths.USERS_PASSWORD_RESET_PATH, { user: { email: email } });
}
