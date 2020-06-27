import License, { LicenseBase } from '../models/License';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import PartialBy from '../util/partialBy';

export type LicensePost = PartialBy<Omit<LicenseBase, 'participant'>, 'eliminated'> & { participant_id: string };

type LicensePaginatedResponse = {
    licenses: License[];
    num_pages: number;
};

/**
 * Gets the licenses associated with the hunt given by the ID.
 * @param huntId The hunt ID of the licenses to be fetching
 * @param params The page and records per page parameters.
 */
export function getLicenses(huntId: string, params: ApiRequest.PaginationParams): Promise<LicensePaginatedResponse> {
    return ApiRequest.getItem<LicensePaginatedResponse>(ApiPaths.licensesPath(huntId), {
        params: params,
    });
}

export function getLicense(licenseId: string): Promise<License> {
    return ApiRequest.getItem<License>(ApiPaths.licensePath(licenseId));
}

export function deleteLicense(licenseId: string): Promise<void> {
    return ApiRequest.deleteItem(ApiPaths.licensePath(licenseId));
}

export function createLicense(huntId: string, license: LicensePost): Promise<License> {
    return ApiRequest.postItem<LicensePost, License>(ApiPaths.licensesPath(huntId), license);
}
