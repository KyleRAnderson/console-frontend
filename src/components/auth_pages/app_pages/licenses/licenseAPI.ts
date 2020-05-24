import { AxiosResponse } from 'axios';
import License, { LicenseBase } from '../../../../models/License';
import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';
import PartialBy from '../../../../util/partialBy';

namespace LicenseAPI {
    export type LicensePost = PartialBy<Omit<LicenseBase, 'participant'>, 'eliminated'> & { participant_id: string };

    export function getLicenses(huntId: string): Promise<AxiosResponse<License[]>> {
        return ApiRequest.getItem<License[]>(ApiPaths.licensesPath(huntId));
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
