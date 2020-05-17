import { AxiosError } from 'axios';

type ServerError<T> = AxiosError<{
    status: string;
    title: string;
    detail: T;
}>;

type ValidatorFunction<T> = {
    (obj: T | any): boolean;
};

function isServerError<T>(error: ServerError<T> | any, dataTyper: ValidatorFunction<T>): boolean {
    return 'status' in error && 'title' in error && 'detail' in error && dataTyper(error.detail);
}

function asServerError<T>(error: ServerError<T> | any, dataTyper: ValidatorFunction<T>): ServerError<T> | undefined {
    return isServerError(error, dataTyper) ? (error as ServerError<T>) : undefined;
}

export default ServerError;
export { isServerError, asServerError };
