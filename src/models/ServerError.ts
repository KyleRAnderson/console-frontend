/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from 'axios';

/**
 * The error attribute that exists on server records.
 */
type RecordError = {
    [key: string]: string[];
};

/**
 * The nicely formatted response that the server will send back when there are user
 * errors with records.
 */
type ServerError = {
    status: string;
    title: string;
    detail: RecordError;
};

function isServerError(error: ServerError | any): boolean {
    return error && 'status' in error && 'title' in error && 'detail' in error;
}

function asServerError(error: AxiosError<ServerError> | any): ServerError | undefined {
    return isServerError(error.response?.data) ? (error.response?.data as ServerError) : undefined;
}

function toSentenceArray(error: ServerError['detail']): string[] {
    return Object.keys(error).reduce<string[]>((total, key) => {
        const properName: string = key[0].toUpperCase() + key.substring(1, key.length);
        const details: string[] = error[key].map((item) => `${properName} ${item}`);
        return [...total, ...details];
    }, []);
}

function formatForPrint(error: ServerError['detail']): string {
    return toSentenceArray(error).join('\n');
}

export default ServerError;
export { isServerError, asServerError, formatForPrint, toSentenceArray, RecordError };
