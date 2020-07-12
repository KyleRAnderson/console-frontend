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
 * @param huntId The hunt ID of the licenses to be fetching
 * @param params The page and records per page parameters.
 */
export function getLicenses(
    huntId: string,
    params: ApiRequest.SearchPaginationParams & Partial<LicenseFilters>,
): Promise<LicensePaginatedResponse> {
    return ApiRequest.getItem<LicensePaginatedResponse>(ApiPaths.licensesPath(huntId), {
        params: { ...params },
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

export type BulkCreateResponse = {
    succeeded: string[];
    failed: LicenseWithErrors[];
};

export function bulkCreateLicenses(
    hunt: string | Hunt,
    participants?: (string | Participant)[],
): Promise<BulkCreateResponse> {
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
