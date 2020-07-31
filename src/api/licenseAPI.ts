import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Hunt from '../models/Hunt';
import License, { LicenseBase, LicenseWithErrors } from '../models/License';
import Participant from '../models/Participant';
import * as ApiPaths from '../routes/ApiPaths';
import PartialBy from '../util/partialBy';
import * as ApiRequest from './apiRequests';

export type LicensePost = PartialBy<Omit<LicenseBase, 'participant'>, 'eliminated'> & { participant_id: string };

type LicensePaginatedResponse = {
    licenses: License[];
    num_pages: number;
};

export type LicenseFilters = {
    eliminated?: boolean;
};

/**
 * Gets the licenses associated with the hunt given by the ID.
 * @param hunt The hunt ID of the licenses to be fetching
 * @param params The page and records per page parameters.
 */
export function getLicenses(hunt: string | Hunt, params: ApiRequest.SearchPaginationParams & Partial<LicenseFilters>) {
    return ApiRequest.getItem<LicensePaginatedResponse>(ApiPaths.licensesPath(hunt), {
        params: { ...params },
    });
}

export function getLicense(license: string | License, config?: AxiosRequestConfig) {
    return ApiRequest.getItem<License>(ApiPaths.licensePath(license), config);
}

export function deleteLicense(license: string | Pick<License, 'id'>) {
    return ApiRequest.deleteItem<void>(ApiPaths.licensePath(license));
}

export function createLicense(hunt: string | Hunt, license: LicensePost) {
    return ApiRequest.postItem<LicensePost, License>(ApiPaths.licensesPath(hunt), license);
}

export function updateLicense(license: string | License, updatedAttributes: Omit<LicensePost, 'participant_id'>) {
    return ApiRequest.patchItem<Omit<LicensePost, 'participant_id'>, License>(
        ApiPaths.licensePath(license),
        updatedAttributes,
    );
}

export function eliminateAll(hunt: string | Hunt) {
    return ApiRequest.patchItem(ApiPaths.eliminateAllPath(hunt));
}

export function eliminateHalf(hunt: string | Hunt) {
    return ApiRequest.patchItem(ApiPaths.eliminateHalfPath(hunt));
}

export type BulkCreateResponse = {
    succeeded: string[];
    failed: LicenseWithErrors[];
};

export function bulkCreateLicenses(hunt: string | Hunt, participants?: (string | Participant)[]) {
    const participantIds: string[] | undefined =
        participants &&
        participants.map((p) => {
            return typeof p === 'string' ? p : p.id;
        });
    return ApiRequest.postItem<{ participant_ids?: string[] }, BulkCreateResponse>(
        ApiPaths.bulkCreateLicensesPath(hunt),
        { participant_ids: participantIds },
    );
}

/** Arguments used to set off instant print. Need to use a map because the order of the keys is important! */
export type InstantPrintArgs = {
    orderings?: ReadonlyMap<string, 'asc' | 'desc'>;
    message?: string | null;
};

function isInstantPrintError(error: AxiosError<unknown>): boolean {
    return typeof error.response?.data === 'string';
}

/**
 * Returns the error message string generated by a failed call to instantPrint, or undefined
 * if the returned error doesn't conform.
 * @param error The axios error returned from a call to instantPrint.
 */
export function asInstantPrintError(error: AxiosError<unknown>): string | undefined {
    return isInstantPrintError(error) ? (error.response?.data as string) : undefined;
}

export function instantPrint(hunt: string | Hunt, instantPrintArgs?: InstantPrintArgs): Promise<AxiosResponse<void>> {
    return ApiRequest.postItem<{ orderings?: [string, 'asc' | 'desc'][] }, void>(ApiPaths.instantPrintPath(hunt), {
        ...instantPrintArgs,
        orderings: instantPrintArgs?.orderings && [...instantPrintArgs.orderings],
    });
}
