import Hunt, { HuntBase } from '../../../../models/Hunt';
import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';
import { AxiosResponse } from 'axios';

namespace HuntAPI {
    export type HuntPost = Pick<HuntBase, 'name'>;

    export function getHunts(rosterId: string): Promise<AxiosResponse<Hunt[]>> {
        return ApiRequest.getItem<Hunt[]>(ApiPaths.huntsPath(rosterId));
    }

    export function getHunt(huntId: string): Promise<AxiosResponse<Hunt>> {
        return ApiRequest.getItem<Hunt>(ApiPaths.huntPath(huntId));
    }

    export function deleteHunt(huntId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.huntPath(huntId));
    }

    export function createHunt(rosterId: string, hunt: HuntPost): Promise<AxiosResponse<Hunt>> {
        return ApiRequest.postItem<HuntPost, Hunt>(ApiPaths.huntsPath(rosterId), hunt);
    }

    export function updateHunt(huntId: string, hunt: HuntPost): Promise<AxiosResponse<Hunt>> {
        return ApiRequest.updateItem<HuntPost, Hunt>(ApiPaths.huntPath(huntId), hunt);
    }
}

export default HuntAPI;
