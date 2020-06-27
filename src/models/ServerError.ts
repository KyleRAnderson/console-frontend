/* eslint-disable @typescript-eslint/no-explicit-any */

type ServerError = {
    status: string;
    title: string;
    detail: { [key: string]: string[] };
};

function isServerError(error: ServerError | any): boolean {
    return 'status' in error && 'title' in error && 'detail' in error;
}

function asServerError(error: ServerError | any): ServerError | undefined {
    return isServerError(error) ? (error as ServerError) : undefined;
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
export { isServerError, asServerError, formatForPrint };
