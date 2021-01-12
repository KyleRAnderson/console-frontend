import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import MiniSignal from 'mini-signals';
import initializeAxios from './axios_initializer';

initializeAxios();

export type PaginationParams = {
    page: number;
    per_page?: number;
};

export type SearchParams = {
    q?: string;
};

export type SearchPaginationParams = PaginationParams & SearchParams;

export type FailureCodeSubscriber = {
    callback: (response: AxiosError) => void;
    code: number;
};

const failureSignals: { [key: number]: MiniSignal } = {};

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

async function extractError<T>(request: Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
    try {
        return await request;
    } catch (err) {
        if (!Axios.isCancel(err)) {
            throw err;
        }
        throw undefined;
    }
}

function setupPromise<T>(promise: Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
    return extractError(setupErrorSubscriber(promise));
}

export function getItem<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return setupPromise(Axios.get<T>(path, config));
}

export function postItem<T, U = void>(path: string, item?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<U>> {
    return setupPromise(Axios.post<U>(path, item, config));
}

export function deleteItem<T = void>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return setupPromise(Axios.delete<T>(path, config));
}

export function patchItem<T = unknown, U = void>(
    path: string,
    item?: T,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<U>> {
    return setupPromise(Axios.patch(path, item, config));
}
