import Axios, { AxiosResponse, AxiosError } from 'axios';
import Auth from './auth';

namespace ApiRequest {
    export type FailureCodeSubscriber = {
        callback: (response: AxiosError) => void;
        code?: number;
    };
    let subscribers: FailureCodeSubscriber[] = [];

    function callSubscribers(error: AxiosError): void {
        subscribers
            .filter((subscriber) => subscriber.code === undefined || subscriber.code === error.response?.status)
            .forEach((subscriber) => subscriber.callback(error));
    }

    export function subscribeToFailureCode(callback: FailureCodeSubscriber): void {
        if (callback.code !== undefined && !(400 <= callback.code && callback.code <= 599)) {
            // Very loose error checking.
            throw new Error(`Invalid HTTP failure code: ${callback.code}.`);
        }
        subscribers.push(callback);
    }

    export function unsubscribeFromAuthFailure(callback: FailureCodeSubscriber): void {
        subscribers = subscribers.filter((subscriber) => subscriber !== callback);
    }

    function setupErrorSubscriber<T>(request: Promise<AxiosResponse<T>>, useAuth: boolean): Promise<AxiosResponse<T>> {
        if (useAuth) {
            request.catch((error) => {
                if ((error as AxiosError).response !== undefined) {
                    callSubscribers(error);
                }
            });
        }
        return request;
    }

    export function getItem<T>(path: string, useAuth: boolean = true): Promise<AxiosResponse<T>> {
        return setupErrorSubscriber(
            Axios.get<T>(path, { headers: Auth.getRequestHeaders(useAuth) }),
            useAuth,
        );
    }

    export function postItem<T, U>(path: string, item: T, useAuth: boolean = true): Promise<AxiosResponse<U>> {
        return setupErrorSubscriber(
            Axios.post<U>(path, item, { headers: Auth.getRequestHeaders(useAuth) }),
            useAuth,
        );
    }

    export function deleteItem<T = any>(path: string, useAuth: boolean = true): Promise<AxiosResponse<T>> {
        return setupErrorSubscriber(
            Axios.delete<T>(path, { headers: Auth.getRequestHeaders(useAuth) }),
            useAuth,
        );
    }
}

export default ApiRequest;
