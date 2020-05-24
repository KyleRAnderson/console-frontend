import Hunt from '../../../../models/Hunt';
import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';
import { AxiosResponse } from 'axios';

namespace HuntAPI {
    export type HuntPost = { name: string };

    export function getHunts(): Promise<AxiosResponse<Hunt[]>> {
        return ApiRequest.getItem<Hunt[]>(ApiPaths.huntsPath);
    }

    export function getHunt(huntId: string): Promise<AxiosResponse<Hunt>> {
        return ApiRequest.getItem<Hunt>(ApiPaths.huntPath(huntId));
    }

    export function deleteHunt(huntId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.huntPath(huntId));
    }

    export function createHunt(hunt: HuntPost): Promise<AxiosResponse<Hunt>> {
        return ApiRequest.postItem<HuntPost, Hunt>(ApiPaths.huntsPath, hunt);
    }

    export function updateHunt(huntId: string, hunt: HuntPost): Promise<AxiosResponse<Hunt>> {
        return ApiRequest.updateItem<HuntPost, Hunt>(ApiPaths.huntPath(huntId), hunt);
    }
}

export default HuntAPI;
