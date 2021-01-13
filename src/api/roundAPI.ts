import { AxiosResponse } from 'axios';
import Hunt from '../models/Hunt';
import Round, { RoundBase } from '../models/Round';
import * as ApiPaths from '../routes/ApiPaths';
import PartialBy from '../util/partialBy';
import * as ApiRequest from './apiRequests';

export type RoundPost = PartialBy<RoundBase, 'number'>;

export function getRounds(hunt: string | Hunt): Promise<AxiosResponse<Round[]>> {
    return ApiRequest.getItem<Round[]>(ApiPaths.roundsPath(hunt));
}

export function getRound(hunt: string | Hunt, roundNumber: number): Promise<AxiosResponse<Round>> {
    return ApiRequest.getItem<Round>(ApiPaths.roundPath(hunt, roundNumber));
}

export function deleteRound(hunt: string | Hunt, roundNumber: number): Promise<AxiosResponse<void>> {
    return ApiRequest.deleteItem(ApiPaths.roundPath(hunt, roundNumber));
}

export function createRound(hunt: string | Hunt, round: RoundPost): Promise<AxiosResponse<Round>> {
    return ApiRequest.postItem<RoundPost, Round>(ApiPaths.roundsPath(hunt), round);
}
