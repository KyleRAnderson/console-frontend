import Hunt, { HuntBase, HuntWithProperties } from '../models/Hunt';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';

export type HuntPost = Pick<HuntBase, 'name'>;

export function getHunts(rosterId: string) {
    return ApiRequest.getItem<Hunt[]>(ApiPaths.huntsPath(rosterId));
}

export function getHunt(huntId: string) {
    return ApiRequest.getItem<HuntWithProperties>(ApiPaths.huntPath(huntId));
}

export function deleteHunt(huntId: string) {
    return ApiRequest.deleteItem(ApiPaths.huntPath(huntId));
}

export function createHunt(rosterId: string, hunt: HuntPost) {
    return ApiRequest.postItem<HuntPost, Hunt>(ApiPaths.huntsPath(rosterId), hunt);
}

export function updateHunt(huntId: string, hunt: HuntPost) {
    return ApiRequest.patchItem<HuntPost, Hunt>(ApiPaths.huntPath(huntId), hunt);
}
