// export default interface Auth {
//     email: string;
//     user_id: string;
//     auth_token: string;
// }

import Axios from 'axios';
import { usersLoginPath, usersLogoutPath } from './routes/ApiPaths';

const emailKey: string = 'email';
const tokenKey: string = 'token';
const idKey: string = 'id';

interface UserResponse {
    id: string;
    email: string;
}

function isLoggedIn(): boolean {
    return getToken().length > 0;
}

function getToken(): string {
    return localStorage.getItem(tokenKey) || '';
}

function getEmail(): string {
    return localStorage.getItem(emailKey) || '';
}

function getUserId(): string {
    return localStorage.getItem(idKey) || '';
}

function getCSRFToken(): string | undefined {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
}

function login(email: string, password: string, callback?: (success: boolean) => void) {
    let authToken: string = '';
    let userID: string = '';
    let success: boolean = false;

    Axios.post<UserResponse>(usersLoginPath, {
        headers: {
            'X-CSRF-Token': getCSRFToken(),
            'Content-Type': 'application/json',
        },
        user: {
            email: email,
            password: password,
        },
    })
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

function logout(callback?: () => void) {
    Axios.delete(usersLogoutPath, {
        headers: {
            'X-CSRF-Token': getCSRFToken(),
            'Content-Type': 'application/json',
        },
    }).then(callback);
}

function storeAuthentication(email: string, authToken: string, userID: string) {
    localStorage.setItem(emailKey, email);
    localStorage.setItem(tokenKey, authToken);
    localStorage.setItem(idKey, userID);
}

export { isLoggedIn, login, logout, getToken, getEmail, getUserId };
