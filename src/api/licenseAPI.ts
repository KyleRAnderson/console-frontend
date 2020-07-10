import License, { LicenseBase } from '../models/License';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import PartialBy from '../util/partialBy';
import Hunt from '../models/Hunt';

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
 * @param huntId The hunt ID of the licenses to be fetching
 * @param params The page and records per page parameters.
 */
export function getLicenses(
    huntId: string,
    params: ApiRequest.SearchPaginationParams,
    filters?: LicenseFilters,
): Promise<LicensePaginatedResponse> {
    return ApiRequest.getItem<LicensePaginatedResponse>(ApiPaths.licensesPath(huntId), {
        params: { ...params, ...filters },
    });
}

export function getLicense(license: string | License): Promise<License> {
    return ApiRequest.getItem<License>(ApiPaths.licensePath(license));
}

export function deleteLicense(license: string | License): Promise<void> {
    return ApiRequest.deleteItem(ApiPaths.licensePath(license));
}

export function createLicense(hunt: string | Hunt, license: LicensePost): Promise<License> {
    return ApiRequest.postItem<LicensePost, License>(ApiPaths.licensesPath(hunt), license);
}

export function eliminateAll(hunt: string | Hunt): Promise<void> {
    return ApiRequest.patchItem(ApiPaths.eliminateAllPath(hunt));
}

export function eliminateHalf(hunt: string | Hunt): Promise<void> {
    return ApiRequest.patchItem(ApiPaths.eliminateHalfPath(hunt));
}
