import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import * as MiniSignal from 'mini-signals';

export type PaginationParams = {
    page: number;
    per_page?: number;
};

export type FailureCodeSubscriber = {
    callback: (response: AxiosError) => void;
    code: number;
};

const failureSignals: { [key: number]: MiniSignal } = {};

/**
 * Reads a cookie at the given key, returning its value, or undefined if it isn't set.
 * @param name The key of the cookie to be read
 */
function readCookie(name: string): string | undefined {
    name = name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // Escape regex characters
    const matches = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return matches?.pop();
}

function getCSRFToken(): string | undefined {
    const cookieValue: string | undefined = readCookie('X-CSRF-Token');
    let csrfToken: string | undefined;
    if (cookieValue) {
        csrfToken = decodeURIComponent(cookieValue);
    }
    return csrfToken;
}

function getRequestHeaders(): { 'X-CSRF-Token'?: string; 'Content-Type': string } {
    return {
        'X-CSRF-Token': getCSRFToken(),
        'Content-Type': 'application/json',
    };
}

function callSubscribers(error: AxiosError): void {
    if (error.response !== undefined) {
        failureSignals[error.response.status]?.dispatch(error);
    }
}

export function subscribeToFailureCode(callback: FailureCodeSubscriber): MiniSignal.MiniSignalBinding {
    if (!(400 <= callback.code && callback.code <= 599)) {
        // Very loose error checking.
        throw new Error(`Invalid HTTP failure code: ${callback.code}.`);
    }
    if (!failureSignals[callback.code]) {
        failureSignals[callback.code] = new MiniSignal();
    }
    return failureSignals[callback.code].add(callback.callback);
}

function setupErrorSubscriber<T>(request: Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
    request.catch((error) => {
        if ((error as AxiosError).response !== undefined) {
            callSubscribers(error);
        }
    });
    return request;
}

async function extractError<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
        const response = await request;
        return response.data;
    } catch (err) {
        if (!Axios.isCancel(err)) {
            throw err;
        }
        throw undefined;
    }
}

function setupPromise<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    return extractError(setupErrorSubscriber(promise));
}

export function getItem<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return setupPromise(
        Axios.get<T>(path, { headers: getRequestHeaders(), ...config }),
    );
}

export function postItem<T, U = void>(path: string, item: T, config?: AxiosRequestConfig): Promise<U> {
    return setupPromise(
        Axios.post<U>(path, item, { headers: getRequestHeaders(), ...config }),
    );
}

export function deleteItem<T = void>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return setupPromise(
        Axios.delete<T>(path, { headers: getRequestHeaders(), ...config }),
    );
}

export function updateItem<T = unknown, U = void>(path: string, item: T, config?: AxiosRequestConfig): Promise<U> {
    return setupPromise(Axios.patch(path, item, { headers: getRequestHeaders(), ...config }));
}
