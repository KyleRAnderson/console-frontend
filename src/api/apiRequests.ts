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

export function getItem<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return setupErrorSubscriber(
        Axios.get<T>(path, { headers: getRequestHeaders(), ...config }),
    );
}

export function postItem<T, U = unknown>(
    path: string,
    item: T,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<U>> {
    return setupErrorSubscriber(
        Axios.post<U>(path, item, { headers: getRequestHeaders(), ...config }),
    );
}

export function deleteItem<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return setupErrorSubscriber(
        Axios.delete<T>(path, { headers: getRequestHeaders(), ...config }),
    );
}

export function updateItem<T = unknown, U = unknown>(
    path: string,
    item: T,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<U>> {
    return setupErrorSubscriber(Axios.patch(path, item, { headers: getRequestHeaders(), ...config }));
}
