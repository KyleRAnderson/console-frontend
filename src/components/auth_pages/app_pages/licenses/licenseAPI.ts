import { AxiosResponse } from 'axios';
import License from '../../../../models/License';
import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';

namespace LicenseAPI {
    export type LicensePost = { participant_id: string; eliminated?: boolean };

    export function getLicenses(huntId: string): Promise<AxiosResponse<License[]>> {
        return ApiRequest.getItem<License[]>(ApiPaths.licensesPath(huntId));
    }

    export function getLicense(huntId: string, licenseId: string): Promise<AxiosResponse<License>> {
        return ApiRequest.getItem<License>(ApiPaths.licensePath(huntId, licenseId));
    }

    export function deleteLicense(huntId: string, licenseId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.licensePath(huntId, licenseId));
    }

    export function createLicense(huntId: string, license: LicensePost): Promise<AxiosResponse<License>> {
        return ApiRequest.postItem<LicensePost, License>(ApiPaths.licensesPath(huntId), license);
    }
}

export default LicenseAPI;
