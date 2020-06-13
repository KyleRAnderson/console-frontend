import Hunt, { HuntBase, HuntWithProperties } from '../models/Hunt';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import { AxiosResponse } from 'axios';
import ServerError, { asServerError } from '../models/ServerError';

export type HuntPost = Pick<HuntBase, 'name'>;
export type HuntErrorResponse = ServerError<{ hunt: string[] }>;

export function asHuntError(error: HuntErrorResponse | unknown): HuntErrorResponse | undefined {
    return asServerError<{ hunt: string[] }>(error, (data) => 'hunt' in data);
}

export function getHunts(rosterId: string): Promise<AxiosResponse<Hunt[]>> {
    return ApiRequest.getItem<Hunt[]>(ApiPaths.huntsPath(rosterId));
}

export function getHunt(huntId: string): Promise<AxiosResponse<HuntWithProperties>> {
    return ApiRequest.getItem<HuntWithProperties>(ApiPaths.huntPath(huntId));
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
