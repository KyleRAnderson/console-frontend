import { AxiosResponse } from 'axios';
import License, { LicenseBase } from '../../../../models/License';
import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';
import PartialBy from '../../../../util/partialBy';

namespace LicenseAPI {
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
    export function getLicenses(
        huntId: string,
        params: ApiPaths.LicenseParams,
    ): Promise<AxiosResponse<LicensePaginatedResponse>> {
        return ApiRequest.getItem<LicensePaginatedResponse>(ApiPaths.licensesPath(huntId), {
            params: params,
        });
    }

    export function getLicense(licenseId: string): Promise<AxiosResponse<License>> {
        return ApiRequest.getItem<License>(ApiPaths.licensePath(licenseId));
    }

    export function deleteLicense(licenseId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.licensePath(licenseId));
    }

    export function createLicense(huntId: string, license: LicensePost): Promise<AxiosResponse<License>> {
        return ApiRequest.postItem<LicensePost, License>(ApiPaths.licensesPath(huntId), license);
    }
}

export default LicenseAPI;
