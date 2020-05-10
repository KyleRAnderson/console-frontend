import Axios, { AxiosResponse } from 'axios';
import Auth from './auth';

namespace ApiRequest {
    export function getItem<T>(path: string, useAuth: boolean = true): Promise<AxiosResponse<T>> {
        return Axios.get<T>(path, { headers: Auth.getRequestHeaders(useAuth) });
    }

    export function postItem<T, U>(path: string, item: T, useAuth: boolean = true): Promise<AxiosResponse<U>> {
        return Axios.post<U>(path, item, { headers: Auth.getRequestHeaders(useAuth) });
    }

    export function deleteItem<T = any>(path: string, useAuth: boolean = true): Promise<AxiosResponse<T>> {
        return Axios.delete<T>(path, { headers: Auth.getRequestHeaders(useAuth) });
    }
}

export default ApiRequest;
